---
source: https://github.com/nicanorflavier/spf-dkim-dmarc-simplified
fetched: 2026-09-13
status: stale
---
SPF, DKIM, and DMARC are the three DNS-based checks receiving mail servers use to decide whether a message really came from the domain it claims to. Set them up in that order — SPF, then DKIM, then DMARC — whenever an app sends transactional or bulk email, so messages land in the inbox instead of spam and the domain can't be spoofed.

## how
- SPF (Sender Policy Framework): a DNS TXT record listing which mail servers may send for your domain.
```
v=spf1 ip4:123.123.123.123 ~all
dig TXT example.com
```
  `~all` (SoftFail, use while testing) vs `-all` (Fail, reject unlisted senders) vs `?all` (Neutral) vs `+all` (Pass — don't use, allows spoofing).
- DKIM (DomainKeys Identified Mail): signs each email with a private key; the public key sits in a DNS TXT record so receivers can verify the signature wasn't tampered with.
```
v=DKIM1; k=rsa; p=<public-key>
dig TXT selector1._domainkey.example.com
```
- DMARC: tells receivers what to do when SPF/DKIM checks fail, and where to send failure reports.
```
v=DMARC1; p=none; rua=mailto:postmaster@example.com
dig _dmarc.example.com TXT
```
- Verify all three with MXToolbox (per-record lookup tools) or DMARCTester (send a probe email or paste headers).

## gotchas
- DMARC without SPF works but is weaker — it can only fall back on DKIM, so run both.
- In an email header with multiple SPF results, trust only the check tied to your own domain; other domains' pass/fail results are from earlier hops and don't affect yours.
- The guide predates Google's and Yahoo's bulk-sender requirements (effective Feb 2024, enforced since Nov 2025): senders of more than 5,000 messages/day to these providers now need SPF+DKIM with DMARC alignment plus one-click unsubscribe, on top of what this guide covers.
