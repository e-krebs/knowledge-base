---
source: https://www.smashingmagazine.com/2024/05/decision-trees-ui-components/
fetched: 2026-09-13
published: 2024-05-29
status: fresh
---
A decision tree for a UI component documents, once and for good, which component to use for a given design situation (e.g. which form control, which onboarding pattern, which error state) so design and dev teams stop re-litigating the same choice. It's written as a flowchart: a starting question about the context, branching through follow-up questions, ending in a concrete component recommendation with an example of what that component looks like.

## how
Each tree starts from a context-defining question ("can the user select more than one option?", "will a given user ever be able to interact with this element?"), then branches on the answer into sub-questions or a final component pick. Teams publish them as part of their design system docs (Figma, Storybook, kitchen-area posters) alongside real examples and use cases, so the tree doubles as documentation for new hires.

One example per design system shown in the article:

- **Doctolib**: a set of decision trees for B2B navigation patterns, form components, actions and calls to action, error design, and help components — "impressive... with decision trees, B2B navigation paths, photography, PIN input, UX writing, and SMS notifications."
- **Workday (Canvas)**: trees for notifications, errors and alerts, loading patterns, calls to action, truncation and overflow, each starting with "a few context-related questions to consider first when making a decision before even jumping into the decision tree."
- **Lyft**: a form-components tree — "we start by exploring whether a user can select more than one option in our UI. If it's indeed multi-select, we use toggles for short options and checkboxes for longer ones... Dropdowns are used as a last resort."
- **NewsKit**: an onboarding-selection toolkit in Figma — "the choice depends on whether we want to interrupt the users to display details (usually isn't very effective), show a feature subtly during the experience (more effective), or enable discovery by highlighting a feature within the context of a task."
- **Nucleus / British Gas / Nordhealth / Aviva / OpenCollective / Zalando / GitHub**: design-system process flowcharts and decision trees for whether to add a new component or extend an existing one — "the entire process at GitHub summarized as a flowchart."

## gotchas
- every project needs its own custom tree — treat these as a starting idea to build upon, not a template to copy as-is
