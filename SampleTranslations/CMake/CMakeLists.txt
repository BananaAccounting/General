cmake_minimum_required(VERSION 3.16)

project(translations_project)                      # <!-- CHANGE THE PROJECT'S NAME
set(EXTENSION_ID "ch.banana.translations")         # <!-- CHANGE THE EXTENSION'S ID

find_package(Qt6 COMPONENTS Core REQUIRED)
find_package(Qt6 COMPONENTS LinguistTools REQUIRED)

FILE(GLOB_RECURSE TS_FILES *.ts)
FILE(GLOB_RECURSE JS_FILES *.js)
FILE(GLOB_RECURSE QML_FILES *.qml)

# This target is used to build the extension to a sbaa package
add_custom_target(translations_project ALL         # <!-- CHANGE THE PROJECT'S NAME
    COMMAND ${QT_CMAKE_EXPORT_NAMESPACE}::rcc -o ${EXTENSION_ID}.sbaa --binary ${EXTENSION_ID}.qrc
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    SOURCES ${EXTENSION_ID}.qrc
    SOURCES ${EXTENSION_ID}.manifest.json
    SOURCES ${TS_FILES}
    SOURCES ${JS_FILES}
    SOURCES ${QML_FILES}
    #SOURCE filename.ext                           # <!-- ADD SOURCE FILES AS NEEDED
)

add_dependencies(${PROJECT_NAME} lrelease) #build .qm files when building the sbaa package

# The variable translations_files contains the list of translations files
set(translations_files
    translations/translations_de.ts
    translations/translations_it.ts
    translations/translations_fr.ts
    #translations/translations_xx.ts              # <!-- ADD LANGUAGES AS NEEDED
)

# The target lupdate is used to update *.ts translations files
set(lupdate_commands)
foreach(tr_file ${translations_files})
  list(APPEND lupdate_commands
    COMMAND ${QT_CMAKE_EXPORT_NAMESPACE}::lupdate ${EXTENSION_ID}.qrc -ts ${tr_file})
endforeach()

add_custom_target(lupdate
    ${lupdate_commands}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    SOURCES ${EXTENSION_ID}.qrc  # A source file is just needed to show the target in qtcreator
                                 # and let it build
    SOURCES ${TS_FILES}
)

# The target lrelease is used to compile *.ts files to *.qm files
set(lrelease_commands)
set(lrelease_files)
string(REPLACE ".ts" "" lrelease_files "${translations_files}") #remove file extension
foreach(tr_file ${lrelease_files})
  list(APPEND lrelease_commands
      COMMAND ${QT_CMAKE_EXPORT_NAMESPACE}::lrelease ${tr_file}.ts -qm ${tr_file}.qm)
endforeach()

add_custom_target(lrelease
    ${lrelease_commands}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    # We don't add source files, we don't need the target to show up in qtcreator
)
