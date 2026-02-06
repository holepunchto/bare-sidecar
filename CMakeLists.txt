cmake_minimum_required(VERSION 4.0)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)
find_package(cmake-bare-bundle REQUIRED PATHS node_modules/cmake-bare-bundle)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)

project(bare_sidecar C)

fetch_package("github:holepunchto/bare@1.26.0")

add_bare_bundle(
  bare_sidecar_bundle
  ENTRY lib/runtime.js
  OUT lib/runtime.bundle.h
  BUILTINS lib/builtins.json
)

add_executable(bare_sidecar)

target_sources(
  bare_sidecar
  PRIVATE
    lib/runtime.c
    lib/runtime.bundle.h
)

set_target_properties(
  bare_sidecar
  PROPERTIES
  C_STANDARD 99
  POSITION_INDEPENDENT_CODE ON
  OUTPUT_NAME bare
  ENABLE_EXPORTS ON
  WINDOWS_EXPORT_ALL_SYMBOLS ON
)

target_link_libraries(
  bare_sidecar
  PUBLIC
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare_static>
  PRIVATE
    rlimit_static
)

link_bare_module(bare_sidecar bare-module)
link_bare_module(bare_sidecar bare-module-lexer)
link_bare_module(bare_sidecar bare-os)
link_bare_module(bare_sidecar bare-pipe)
link_bare_module(bare_sidecar bare-url)

bare_target(target)

install(TARGETS bare_sidecar RUNTIME DESTINATION ${target})
