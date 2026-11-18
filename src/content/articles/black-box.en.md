---
title: "What happened, and how I know"
lead: "Building a black box for your own infrastructure: four layers of traceability, refusing a global audit, and a deployment that reported success without configuring anything."
date: 2026-11-18
lang: en
slug: black-box
translation: boite-noire
readingTime: "8 min"
---

When a service goes down, the question is never "did it crash?". The question is
"what happened just before?". And the most common answer, when nothing was prepared,
is: we don't know.

This article is about building a black box on my own infrastructure so I could stop
answering that.

## The starting paradox

In November I wanted to know why one of my machines had vanished from the network for a
week. System journal empty. No trace. Nothing to read.

That is the paradox: **the journal existed**, but only in memory. It disappears exactly
when you need it, at reboot. I had a black box that erased itself on impact.

The second problem is more insidious: no traceability for privileged actions. `sudo`
leaves a trace in the shell, not in a file you can read three weeks later.

## Four layers, one per question

I did not look for a single solution. I split the problem into four questions and gave
each one its own layer.

**"What did the system say?"** The systemd journal, made persistent. Without it nothing
else is usable: each machine writes to `/var/log/journal` with a 500 MB cap and 30 days
of retention. The cap matters. Without it, one chatty service fills the disk and causes
the very outage you were trying to diagnose.

**"Who touched what, with privileges?"** auditd, with its 16 rules. That is the most
important design decision in the project, and I come back to it below.

**"What was typed?"** Timestamped bash history, written immediately on every prompt. A
command typed thirty seconds before a crash must not vanish with the session.

**"What did the machine look like just before?"** A snapshot every five minutes: load,
memory, top CPU, disk, failed services, container state. This one still answers when the
journal is corrupted.

## The decision that matters: no global `execve` audit

The natural reflex, when you want to trace commands, is to audit every `execve`, every
process launched, no exceptions. I ruled it out, for two reasons.

Volume first: tens of thousands of entries a day on a modest machine, for information
buried in noise.

**Secret leakage** second, and this is the real reason. auditd records command arguments
(`argc`, `a0` through `a3`). A global audit therefore writes, in clear text, everything
that passes on a command line: a password after `-S`, a token, a database URL. **A black
box that leaks credentials is worse than no black box at all**, because it concentrates
in one file everything that used to be scattered.

So I targeted sensitive files and binaries instead of processes: identities
(`/etc/passwd`, `/etc/shadow`), privileges (`sudoers`), network (`/etc/hosts`, SSH
configuration), mounts, kernel module loading, systemd services, scheduled tasks, and
execution of `sudo` and `su`. Sixteen rules, each one justifiable.

That limit has an accepted cost: a password passed as an argument to `sudo` still shows
up, because the `admin_exec` rule records the first arguments. It is not leak-free, it
is a reduced perimeter.

There is a second, structural limit: these 16 rules are a snapshot of what I know how to
watch today. They come from a hand-written list. The day a sensitive file appears
somewhere else, nobody watches it. An audit is never more exhaustive than the list it
derives from.

## The tool: one question, one command

A diagnostic tool is only worth something if it works cold, when you are already stressed
and something is broken. So I put consultation behind a single command, `boite-noire`,
with seven entries.

The most important one is the one I never had: `crash`. It reads `journalctl -b -1`,
meaning **the end of the previous session**, not the current boot, which contains nothing
interesting after a reboot.

The others answer one precise question each: recent commands per user, privileged
actions, failed services, network and DNS changes, an overview, and a dated export to get
the data off the machine.

## What it actually changed

One machine had been missing from the network for a week. Without a black box, the
natural conclusion would have been "it crashed, reinstall it".

The persistent journal reopened the previous boot. The end of that session showed a
**clean shutdown**, with services stopping in order. No crash, no failure: a power cut,
and a normal system halt before power was lost. The machine came back on the first
reboot, no component was at fault.

Without the trace, I would have reinstalled a healthy system and hunted a cause that did
not exist. That is the difference between a hunch and a fact.

## The deployment that reported success

The most useful part of this project is a failure, and it is worth telling.

The install script runs five steps: configure journald, install auditd, write the rules,
set up bash history, create the snapshot timer. At the end it prints a summary and runs
the display command. On two machines it worked first time.

On the third one, the machine that hosts the agent driving everything else, I ran it from
a container. The script walked through its five steps, printed its summary, and exited
without an error. **It had configured nothing.**

The reason is obvious once you see it: inside a container, `systemctl`, `journalctl` and
`auditctl` do not exist. The script called them with stderr redirected to `/dev/null`,
which hid every failure. It therefore reported a complete installation on a machine where
it had not written a single line.

What that taught me is worth more than the four layers combined: **a script that keeps
going after a masked failure does not produce a partial install, it produces false
information.** I made the install loud where it matters: it now detects that it is
running inside a container and refuses to continue before touching the system.

```
❌ Cible = conteneur (pid 1 : s6-svscan)
   journald persistant, auditd et timers systemd n'existent pas ici.
   Rien n'a été modifié.
```

A deployment that fails loudly costs five minutes. A deployment that succeeds without
doing anything costs months, because you believe you are covered.

## What is not covered today

As of this article, the black box is deployed and verified on two machines, with measured
volumes. The third one, the machine hosting the central agent, is not: this is exactly
the incident described above, and it is not closed.

I would rather write that down than let a diagram imply full coverage. It is the next
step, and it carries a constraint the other two did not have: it has to be installed on
the host, not from the container I live in.

## Accepted limits

- **No centralisation.** Each machine keeps its black box locally. If a machine dies for
  good, its black box dies with it. A manual export brings the data back, it is not
  automatic.
- **30 days of retention** and a 500 MB cap: beyond that, rotation happens on size rather
  than age.
- **No alerting.** This is a passive device: it tells, it does not warn. A scheduled
  analysis looking for suspicious patterns would be the next step.
- **Systemd dependency.** Installation assumes systemd, journald and auditd. That is not
  a flaw in itself, but it excludes containerised targets, which is precisely the case of
  the missing machine.

## What I take away

The technical lesson is thin, and I accept that: reading `journalctl -b -1` is not
clever. The work was in refusing the global audit so as not to manufacture a credential
leak, and in making the diagnosis usable through one command while everything is already
breaking.

The more general lesson: **an undocumented outage costs twice**, once when it happens and
once when you go looking for why. The black box did not make my infrastructure more
reliable. It made my outages readable.
