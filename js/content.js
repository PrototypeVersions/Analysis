// Original practice material. All answer rationales refer to this passage or the hypothetical question.

export const PASSAGE = [
  [
    {
      "id": "p1s1",
      "voice": "narration",
      "text": "Consider a dispute about a Renaissance fresco cycle: after cleaning, its figures appear in startlingly bright acid greens, hot pinks, and clear lemon yellows."
    },
    {
      "id": "p1s2",
      "voice": "narration",
      "text": "Generations of viewers had known the same figures as sober and smoky."
    },
    {
      "id": "p1s3",
      "voice": "narration",
      "text": "Many visitors were delighted; some critics were appalled."
    },
    {
      "id": "p1s4",
      "voice": "critics",
      "cue": "they charged",
      "text": "The restorers, they charged, had not uncovered the painting but invented a new one."
    },
    {
      "id": "p1s5",
      "voice": "narration",
      "text": "The disagreement is not simply about whether the new colors are attractive. It concerns which version of a familiar object deserves to be called authentic, and whether familiarity itself has any claim on those responsible for its care."
    }
  ],
  [
    {
      "id": "p2s1",
      "voice": "narration",
      "text": "The restorers in this dispute defend a particular view of authenticity."
    },
    {
      "id": "p2s2",
      "voice": "restorers",
      "node": "OV",
      "cue": "On this view",
      "text": "On this view, a work of art is authentic to the degree that it matches the object as it left the artist’s hands."
    },
    {
      "id": "p2s3",
      "voice": "restorers",
      "node": "OV",
      "text": "Grime, yellowed varnish, and the retouchings of later centuries are accretions; removing them returns us to the real thing."
    },
    {
      "id": "p2s4",
      "voice": "restorers",
      "node": "OV",
      "text": "The restorer’s ideal is to make time run backward."
    },
    {
      "id": "p2s5",
      "voice": "restorers",
      "node": "OV",
      "text": "Later viewers may have become attached to a changed appearance, but that attachment, the restorers argue, cannot give an accidental alteration the authority of the artist’s deliberate choice."
    }
  ],
  [
    {
      "id": "p3s1",
      "voice": "author",
      "node": "T",
      "cue": "I want to suggest",
      "text": "I want to suggest that this ideal, however natural it seems, rests on a confusion."
    },
    {
      "id": "p3s2",
      "voice": "author",
      "node": "T",
      "text": "A painting is not a frozen event but a physical object with a history, and some of that history cannot be separated from what the work has come to mean."
    },
    {
      "id": "p3s3",
      "voice": "author",
      "node": "R1",
      "text": "The dimming of a canvas is not merely dirt laid over meaning; for centuries it has shaped how the work was seen, copied, and described."
    },
    {
      "id": "p3s4",
      "voice": "author",
      "node": "R1",
      "text": "When a later painter studied a master’s “somber palette,” the somberness he learned from was real, even if the master never intended it."
    },
    {
      "id": "p3s5",
      "voice": "author",
      "node": "R1",
      "text": "To scrub it away is to erase the evidence of a conversation in which the work took part."
    },
    {
      "id": "p3s6",
      "voice": "author",
      "node": "R1",
      "text": "A photograph can document an earlier condition, but it cannot preserve that condition in the object itself. Keeping a record and keeping the work’s accumulated history are different achievements."
    }
  ],
  [
    {
      "id": "p4s1",
      "voice": "author",
      "node": "R2",
      "cue": "Nor can",
      "text": "Nor can the restorer’s ideal be fully achieved."
    },
    {
      "id": "p4s2",
      "voice": "author",
      "node": "R2",
      "text": "Pigments do not merely darken; some fade, some shift in hue, and some react with their neighbors."
    },
    {
      "id": "p4s3",
      "voice": "author",
      "node": "R2",
      "text": "No cleaning can return a four-hundred-year-old surface to its original appearance; at best it produces a new state, guided by the restorer’s judgment about what the artist must have wanted."
    },
    {
      "id": "p4s4",
      "voice": "author",
      "node": "R2",
      "text": "That judgment may be well informed, but it is a judgment, and to present its results as “the original” is to disguise interpretation as discovery."
    },
    {
      "id": "p4s5",
      "voice": "author",
      "node": "R2",
      "text": "The distinction matters even when the resulting image is persuasive: confidence in an approximation does not make it identical to what has been lost."
    }
  ],
  [
    {
      "id": "p5s1",
      "voice": "author",
      "node": "C",
      "cue": "None of this means",
      "text": "None of this means that paintings should be left to decay."
    },
    {
      "id": "p5s2",
      "voice": "author",
      "node": "C",
      "text": "Stabilizing flaking paint or halting active damage protects the object whose history we care about."
    },
    {
      "id": "p5s3",
      "voice": "author",
      "node": "Rec",
      "cue": "What I resist",
      "text": "What I resist is the further step of erasing that history for the sake of an origin we can only approximate."
    },
    {
      "id": "p5s4",
      "voice": "author",
      "node": "Rec",
      "text": "A restored painting should wear its age honestly, and where intervention is unavoidable, it should remain visible to the informed eye: a repair rather than a disguise."
    }
  ]
];

export const QUESTIONS = [
  {
    "skill": "Reasoning beyond the text",
    "tool": "trace",
    "focusNode": "R2",
    "toolHead": "Explore the explanation",
    "stem": "Which of the following findings, if true, would most seriously challenge the author’s argument in paragraph 4?",
    "choices": [
      {
        "id": "A",
        "text": "A new cleaning method reliably reverses all age-related changes in a painting’s surface, recovering its original appearance without conjecture about the artist’s intentions.",
        "target": "R2",
        "effect": "undercuts",
        "rationale": "Accept this finding as true for the hypothetical question. It directly challenges paragraph 4’s claim that the original appearance cannot be recovered without interpretation. It does not answer paragraph 3’s separate concern about losing historically meaningful changes."
      },
      {
        "id": "B",
        "text": "Most museum visitors prefer paintings that have been cleaned to those that have not.",
        "target": null,
        "effect": "misses",
        "rationale": "Visitor preference concerns the appeal of cleaning, but it does not establish whether cleaning can recover an original appearance. The author already acknowledges delighted viewers in paragraph 1. This finding does not weaken the targeted reason."
      },
      {
        "id": "C",
        "text": "Painters in later centuries often based their own palettes on darkened versions of earlier works.",
        "target": "R1",
        "effect": "supports",
        "rationale": "This supports paragraph 3: an aged appearance can influence later artists and become historically meaningful. It leaves paragraph 4’s claim about recovering the original appearance unchallenged."
      },
      {
        "id": "D",
        "text": "Stabilizing flaking paint sometimes requires adding new material to a painting’s surface.",
        "target": "C",
        "effect": "fits",
        "rationale": "Paragraph 5 allows treatment to halt active damage. Adding material during stabilization is compatible with that qualification and does not show that an original appearance can be recovered."
      }
    ],
    "answer": "A",
    "explanation": "Paragraph 4 argues that restoration cannot fully recover an original appearance because aging changes the surface and restoration requires interpretation. The hypothetical method in A directly challenges that reason. The author could still defend paragraph 3’s separate argument that accumulated history matters; weakening one reason does not refute the whole passage.",
    "takeaway": "Identify the precise claim the question targets. Then ask how the new information changes its support. A weakener need not disprove an entire argument. Here, A undermines paragraph 4, C supports a different reason, and B and D do not challenge the targeted claim.",
    "activity": "Evaluate new evidence"
  },
  {
    "skill": "Reasoning within the text",
    "tool": "voice",
    "toolHead": "Separate the reported views from the author’s position",
    "stem": "Based on the passage, the author would most likely agree with the critics described in paragraph 1 that:",
    "choices": [
      {
        "id": "A",
        "text": "the cleaned fresco is not, strictly speaking, the painting as its artist left it.",
        "evidence": [
          "p1s4",
          "p4s3",
          "p4s4"
        ],
        "rationale": "The critics say that cleaning did not simply uncover the painting. The author likewise argues in paragraph 4 that cleaning produces a new state. Both positions support the limited conclusion in A, even though the author does not establish that restorers fabricated colors."
      },
      {
        "id": "B",
        "text": "the restorers introduced colors that the artist never used.",
        "evidence": [
          "p1s4",
          "p4s4"
        ],
        "rationale": "“Invented a new one” may tempt you to infer fabricated colors. Neither that phrase nor the author’s discussion establishes that any color was never used by the artist. B adds a specific accusation that the passage does not support."
      },
      {
        "id": "C",
        "text": "visitors were wrong to be delighted by the brighter colors.",
        "evidence": [
          "p1s3"
        ],
        "rationale": "The passage reports that visitors were delighted but never judges their reaction. The author’s argument concerns what restoration can claim to recover, not whether its results can be enjoyed."
      },
      {
        "id": "D",
        "text": "the fresco should have been left untreated, whatever its condition.",
        "evidence": [
          "p5s1",
          "p5s2"
        ],
        "rationale": "The author explicitly permits stabilization of active damage in paragraph 5. D’s “whatever its condition” conflicts with that qualification. The critics’ reported statement also does not establish that they would reject every treatment."
      }
    ],
    "answer": "A",
    "explanation": "Connect the critics’ statement in paragraph 1 with the author’s reasoning in paragraph 4. Both question whether the cleaned work is simply the original recovered. A expresses that shared point. The passage does not support the more specific claim that colors were fabricated, a judgment against visitors’ enjoyment, or a ban on all treatment.",
    "takeaway": "Compare the actual commitments of each viewpoint. An answer must be supported by both positions to describe their agreement. Do not choose an answer merely because it sounds moderate, or reject one merely because its language is strong.",
    "activity": "Compare perspectives"
  },
  {
    "skill": "Reasoning beyond the text",
    "tool": "principle",
    "toolHead": "Compare the choices with the passage",
    "stem": "A museum learns that a seventeenth-century altarpiece was extensively overpainted in the nineteenth century by an artist who “corrected” its figures. The overpainting is stable and is not damaging the panel beneath it. Based on the passage, which response would the author most likely favor?",
    "ruleSource": "paragraphs 4 and 5",
    "criteria": [
      {
        "id": "history",
        "label": "Preserves the later layer",
        "source": "p5s3",
        "note": "The author resists erasing accumulated history."
      },
      {
        "id": "honest",
        "label": "Makes later changes identifiable",
        "source": "p5s4",
        "note": "Necessary repairs should remain visible to an informed viewer."
      }
    ],
    "choices": [
      {
        "id": "A",
        "text": "Remove the overpainting, since it was never part of the original artist’s design.",
        "checks": {
          "history": "no",
          "honest": "unknown"
        },
        "rationale": "A removes a stable historical layer solely because it was not the first artist’s work. That follows the opposing view in paragraph 2 and conflicts with the author’s preference for preserving accumulated history. The choice does not specify how the removal would be disclosed."
      },
      {
        "id": "B",
        "text": "Keep the overpainting, and publish technical images showing the earlier layer beneath it.",
        "checks": {
          "history": "yes",
          "honest": "yes"
        },
        "rationale": "B best fits the author’s stated priorities: retain a stable historical layer and make the earlier layer available for study without removing it. The technical images also reveal the distinction between the layers. This is an application of the passage’s position, not a universal conservation rule."
      },
      {
        "id": "C",
        "text": "Remove the overpainting, but keep a detailed photographic record and label the painting to identify the removal.",
        "checks": {
          "history": "no",
          "honest": "yes"
        },
        "rationale": "C records and identifies the intervention, but still removes the stable later layer. Paragraph 3 distinguishes keeping a record from keeping the historical condition in the object. Documentation addresses transparency; it does not resolve the author’s objection to removal."
      },
      {
        "id": "D",
        "text": "Keep the overpainting, but retouch the edges where the two painters’ work meets so that the boundary can no longer be seen.",
        "checks": {
          "history": "yes",
          "honest": "no"
        },
        "rationale": "D retains the later layer but deliberately makes the boundary undetectable. That conflicts with the author’s preference for interventions that remain discernible to an informed viewer."
      }
    ],
    "answer": "B",
    "explanation": "Because the later layer is stable, the author’s allowance for treating active damage does not justify its removal. B preserves the layer while revealing the earlier work through images. C is the closest alternative, but its photographic record does not preserve the historical condition in the object itself.",
    "takeaway": "Apply the author’s priorities to the facts given, including relevant qualifications. Distinguish an explicit conflict from information the choice never supplies. A missing detail is not automatically a violation, and a useful record is not the same as preserving a physical layer.",
    "activity": "Apply a position"
  }
];
