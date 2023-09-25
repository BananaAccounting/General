cmake_minimum_required(VERSION 3.16)

project(simpleproject)
set(EXTENSION_ID "ch.banana.sample.simpleproject")

# CMake options
# Create a file .vscode/settings.json with the following content to set the options, 
# adapt the path to your environment
# {
#     "cmake.configureSettings": {
#         "BAN_QT_RCC": "C:/users/user_name/AppData/Local/Programs/BananaPlusDev/rcc.exe",
#         "BAN_EXE_PATH": "C:/users/user_name/AppData/Local/Programs/BananaPlusDev/BananaPlusDev.exe",
#     }
# }
set(BAN_QT_RCC $ENV{BAN_QT_RCC} CACHE FILEPATH "Path to Qt rcc executable")
set(BAN_EXE_PATH $ENV{BAN_EXE_PATH} CACHE FILEPATH "Path to BananaPlus executable, used to run tests")

# This target is used to build the extension to a sbaa package
add_custom_target(${PROJECT_NAME}
    COMMAND ${BAN_QT_RCC} -o ${EXTENSION_ID}.sbaa --binary ${EXTENSION_ID}.qrc
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    SOURCES ${EXTENSION_ID}.qrc
)

# This target is used to run the tests of the extension
add_custom_target(test
    COMMAND ${BAN_EXE_PATH} -cmd=runtestsapps -cmd_exit=1 -cmd_p1=${CMAKE_SOURCE_DIR}/${EXTENSION_ID}.sbaa -cmd_op=A
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
)
