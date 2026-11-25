cmake_minimum_required(VERSION 4.0)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)
find_package(cmake-bare-bundle REQUIRED PATHS node_modules/cmake-bare-bundle)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)
find_package(cmake-prelude REQUIRED PATHS node_modules/cmake-prelude)

project(bare_sidecar C)

file(READ "${CMAKE_CURRENT_LIST_DIR}/versions.json" versions)

set_property(DIRECTORY APPEND PROPERTY CMAKE_CONFIGURE_DEPENDS "${CMAKE_CURRENT_LIST_DIR}/versions.json")

string(JSON bare_version GET "${versions}" bare)

fetch_package("github:holepunchto/bare@${bare_version}")

bare_target(target)

add_bare_bundle(
  bare_sidecar_bundle
  ENTRY lib/runtime.js
  OUT lib/runtime.bundle.h
  BUILTINS lib/builtins.json
)

set(sources
  lib/runtime.c
  lib/runtime.bundle.h
)

if(WIN32)
  list(APPEND sources lib/bare.manifest)
endif()

add_executable_target(
  bare_sidecar
  SOURCES
    ${sources}
  FEATURES
    c_std_99
  LINK
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare::static>
    bare::exports
    rlimit::static
  DESTINATION
    ${target}
  EXPORT OFF
)

set_target_properties(
  bare_sidecar_executable
  PROPERTIES
  OUTPUT_NAME bare
)

link_bare_modules(bare_sidecar::executable FROM lib/builtins.json EXCLUDE_FROM bare::static)
