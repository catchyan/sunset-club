# Telemetry Spec

> Status: **STUB** · Owner: C1 · Drafting: **starts at M4, must be complete before M5**
> Placeholder file. Rationale at the top of `gdd-encounters.md`.

---

## Preconditions for drafting

- [ ] M4's character lifecycle (growth, Retire, Lineage) implemented
- [ ] a draft of `contracts/telemetry-events.md`

## Why this spec has to come before the economy

Iron law one of the economy-change SOP: **build the monitoring first, then move the numbers.**

An economy change with no telemetry behind it is refused, without exception. So the telemetry spec has to be in place before M5 starts — otherwise M5 opens with "this drop rate looks a bit high to me" tuning by feel, and that is the standard route to an economy that collapses.

## Questions this file will answer

1. **Event list**: the name, fields, trigger point, and sampling rate of every event.
2. **How the eight economy criteria are computed**: inflation rate, Gini coefficient, hourly earnings, service-player income, scripted-farming return rate — each one needs an unambiguous definition.
3. **Privacy boundary**: what we do not collect.
4. **Performance constraint**: events are written asynchronously and never block game logic (`architecture.md §7`).
5. **Board**: the fixed format of `board/telemetry/<week>.md`.
6. **Anomaly alerts**: which data movements should raise an alert automatically instead of waiting for the weekly report.

## One design discipline

**Work out "what will I do when this number moves" before deciding whether to collect it.**

Collecting a metric with no action attached to it does one thing: it makes the weekly report longer and buries the signals that matter.
If you cannot answer "what will I do if this number rises 20%", do not collect it.
