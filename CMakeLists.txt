cmake_minimum_required(VERSION 3.5)

project(robot3D VERSION 0.1 LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(QT NAMES Qt6 Qt5 REQUIRED
        COMPONENTS
        Widgets
        WebEngineWidgets
)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED
        COMPONENTS
        Widgets
        WebEngineWidgets
)

set(PROJECT_SOURCES
        main.cpp
)

add_executable(${PROJECT_NAME}
    ${PROJECT_SOURCES}
)

target_link_libraries(${PROJECT_NAME}
        PRIVATE
        Qt::Widgets
        Qt${QT_VERSION_MAJOR}::WebEngineWidgets
)


