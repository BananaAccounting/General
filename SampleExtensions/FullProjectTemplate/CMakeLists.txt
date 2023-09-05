cmake_minimum_required(VERSION 3.16)

project(fullproject)
set(EXTENSION_ID "ch.banana.sample.fullproject")

# CMake options
# Create a file .vscode/settings.json with the following content to set the options, 
# adapt the path to your environment
# {
#     "cmake.configureSettings": {
#         "BAN_QT_RCC": "C:/users/user_name/AppData/Local/Programs/BananaPlusDev/rcc.exe",
#         "BAN_EXE_PATH": "C:/users/user_name/AppData/Local/Programs/BananaPlusDev/BananaPlusDev.exe",
#         "BAN_QT_LUPDATE": "C:/Qt/6.5.2/macos/bin/lupdate",
#         "BAN_QT_LRELEASE": "C:/Qt/6.5.2/macos/bin/lrelease"
#     }
# }
set(BAN_QT_RCC $ENV{BAN_QT_RCC} CACHE FILEPATH "Path to Qt rcc executable")
set(BAN_EXE_PATH $ENV{BAN_EXE_PATH} CACHE FILEPATH "Path to BananaPlus executable, used to run tests")
set(BAN_QT_LUPDATE $ENV{BAN_QT_LUPDATE} CACHE FILEPATH "Path to Qt lupdate executable")
set(BAN_QT_LRELEASE $ENV{BAN_QT_LRELEASE} CACHE FILEPATH "Path to Qt lrelease executable")

# This target is used to build the extension to a sbaa package
add_custom_target(fullproject
    COMMAND ${BAN_QT_RCC} -o ${EXTENSION_ID}.sbaa --binary ${EXTENSION_ID}.qrc
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    SOURCES ${EXTENSION_ID}.qrc
)

# This target is used to run the tests of the extension
add_custom_target(test
    COMMAND ${BAN_EXE_PATH} -cmd=runtestsapps -cmd_exit=1 -cmd_p1=${CMAKE_SOURCE_DIR}/${EXTENSION_ID}.sbaa -cmd_op=A
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)

# The variable translations_files contains the list of translations files
set(translations_files
    translations/translations_de.ts
    translations/translations_it.ts
    translations/translations_fr.ts
)

# The target lupdate is used to update *.ts translations files
set(lupdate_commands)
foreach(tr_file ${translations_files})
  list(APPEND lupdate_commands
    COMMAND ${BAN_QT_LUPDATE} ${EXTENSION_ID}.qrc -ts ${tr_file})
endforeach()

add_custom_target(lupdate
    ${lupdate_commands}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)

# The target lrelease is used to compile *.ts files to *.qm files
set(lrelease_commands)
set(lrelease_files)
string(REPLACE ".ts" "" lrelease_files "${translations_files}") #remove file extension
foreach(tr_file ${lrelease_files})
  list(APPEND lrelease_commands
      COMMAND ${BAN_QT_LRELEASE} ${tr_file}.ts -qm ${tr_file}.qm)
endforeach()

add_custom_target(lrelease
    ${lrelease_commands}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)

add_dependencies(${PROJECT_NAME} lrelease) #build .qm files when building the sbaa package
