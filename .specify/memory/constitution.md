# AI World Hub Constitution
<!-- Spec Constitution for AI World Hub -->

## Core Principles

### Library-First
Every feature starts as a standalone library. Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries.

### CLI Interface
Every library exposes functionality via CLI. Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats.

### Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced.

### Integration Testing
Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas.

### Observability
Text I/O ensures debuggability; Structured logging required; MAJOR.MINOR.BUILD format; Start simple, YAGNI principles.

## Governance
Constitution supersedes all other practices; Amendments require documentation, approval, migration plan; Complexity must be justified; Use guidance files for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-07-15 | **Last Amended**: 2026-08-18
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->