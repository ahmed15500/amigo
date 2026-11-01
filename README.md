# Amigo — prototype

An Arabic RTL course-catalog prototype written in Rust using only the standard library. Faculty and course data are illustrative, not real institutional information. It does not imply university approval or affiliation.

## Run locally

Install a current stable Rust toolchain, then run:

```sh
cargo test
cargo run
```

Open http://127.0.0.1:3000. Set `AMIGO_BIND=0.0.0.0:3000` only when deliberately exposing the demo on a trusted network. This minimal demo server is not hardened for public production deployment.

## What is implemented

- Faculty listing, individual faculty pages, and grouping by academic year and term.
- A catalog with faculty, shared/specialist, level, language, teacher, and text filters; a separate shared-course view.
- A single Rust `Course` record can refer to multiple faculty IDs. A course is shared if it has more than one faculty, including a subset of faculties.
- Course detail pages, example instructors, indicative subscription options, and informational pages.
- A local-only faculty/year selector and matching recommendations. Selection remains in browser local storage; it does not create an account or enroll the visitor.

## Before real use

Replace hard-coded example data and implement a persistent database with a many-to-many `course_faculty` junction and per-faculty academic placement. Add authentication, authorization, an admin and instructor area, course content, progress, payment provider integration, verified purchase entitlements and revenue allocation, account settings, real pricing, contact information, and reviewed legal policies. Nothing here processes payments, provides access control, collects registrations, or issues certificates. Do not put student data or credentials into this demo. Faculty names, courses and claims of affiliation require approval and verification.

Single-course purchase is described as access to the chosen course only; faculty and all-access subscriptions include shared courses. Implement and confirm commercial terms before enabling purchases.
