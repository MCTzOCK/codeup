var _a;
/**
 * packages/util/src/models/Certificate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */
import mongoose from "mongoose";
const Certificate = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
    minPercentage: {
        type: Number,
        required: true,
    },
    steps: {
        type: ["Mixed"],
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.Certificate) ||
    mongoose.model("Certificate", Certificate);
/*

====================
Schema as JSON File
====================


{
  "course": "Course-ID",
  "minPercentage": 50,
  "steps": [
    {
      "step_type": "MULTIPLE_CHOICE | TEXT | CODE_COMPARE | CODE_CHECK",
      "step_title": "Step Title",
      "multiple_choice": {
        "question": "Question",
        "answers": [
          {
            "answer": "Answer #N",
            "correct": false
          }
        ]
      },
      "text_parts": [
        {
          "type": "TEXT",
          "value": "<button>"
        },
        {
          "type": "INPUT",
          "value": "klick mich"
        }
      ],
      "code_compare": {
        "code_a": {
          "correct": false,
          "screenshot": "https://screen.shot/.png"
        },
        "code_b": {
          "correct": false,
          "screenshot": "https://screen.shot/.png"
        },
        "output": "https://screen.shot/.png"
      },
      "code_check": {
        "code_a": {
          "correct": false,
          "screenshot": "https://screen.shot/.png"
        },
        "code_b": {
          "correct": false,
          "screenshot": "https://screen.shot/.png"
        }
      }
    }
  ]
}


 */
