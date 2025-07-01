    //initialize jsPsych
    var jsPsych = initJsPsych();

    // create timeline
    var timeline = [];

    const nouns = ["","","",""]

    function updateProgress(blockNumber) {
      for (let i = 1; i <= 4; i++) {
        const segment = document.getElementById(`prog${i}`);
        if (i <= blockNumber) {
          segment.classList.add("progress-active");
        } else {
          segment.classList.remove("progress-active");
        }
      }
    }


    /* define welcome message trial */
    var welcome = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="max-width: 700px; margin: 0 auto; text-align: left; line-height: 1.6; font-size: 16px;">
            <h2 style="text-align: center;">Consent to Participate</h2>

            <p>You will learn an artificial language to describe simple images of everyday objects. The session will take 10~20 minutes. You will be paid 10.50 pounds/hour via Prolific.</p>

            <p>There are no known risks. All data will be anonymised and stored securely. You may withdraw at any time, and can request data deletion within 2 weeks.</p>

            <p>This project is approved by the PPLS Ethics Committee.</p>

            <p>Contact: <a href="mailto:S.Sun-46@sms.ed.ac.uk">S.Sun-46@sms.ed.ac.uk</a></p>

            <p><strong>By clicking "Accept", you confirm that you agree to participate and understand your rights.</strong></p>

            <p><a href="consent/FINALConsentSheet.pdf" target="_blank"> View the full consent form (PDF)</a></p>
        </div>
    `,
      choices: ["Accept"]
    };
    timeline.push(welcome);

    const block1_intro = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="max-width: 700px; margin: auto; text-align: left; font-size: 18px; line-height: 1.6;">
          <h3>Block 1: Passive Exposure</h3>
          <p>In this part, you will see pictures with short descriptions.</p>
          <p>Simply click the "Next" button to continue through the trials.</p>
          <p><em>You will see 24 trials in this block.</em></p>
        </div>
      `,
      choices: ['Begin Block 1'],
      on_finish: function () {
        document.getElementById("progress-container").style.display = "flex";
        updateProgress(1);
      }
    };

    timeline.push(block1_intro);

    //Block 2 Introduction
    const block2_intro = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="max-width: 700px; margin: auto; text-align: left; font-size: 18px; line-height: 1.6;">
          <h3>Block 2: Picture Matching</h3>
          <p>In this part, you will see a sentence and two pictures.</p>
          <p>Please select the picture that matches the sentence.</p>
          <p>You will see 24 trials in this block.</p>
          <p><em>You can click anywhere to continue.</em></p>
        </div>
      `,
      choices: ['Begin Block 2'],
      on_finish: function () {
        document.getElementById("progress-container").style.display = "flex";
        updateProgress(2);
      }
    };

    //Block 2 Introduction
    const block3_intro = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="max-width: 700px; margin: auto; text-align: left; font-size: 18px; line-height: 1.6;">
          <h3>Block 3: Sentence Matching</h3>
          <p>In this part, you will see a picture and two sentences.</p>
          <p>Please select the sentence that matches the picture.</p>
          <p>You will see 24 trials in this block.</p>
          <p><em>You can click anywhere to continue.</em></p>
        </div>
      `,
      choices: ['Begin Block 3'],
      on_finish: function () {
        document.getElementById("progress-container").style.display = "flex";
        updateProgress(3);
      }
    };

    const block4_intro = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div style="max-width: 700px; margin: auto; text-align: left; font-size: 18px; line-height: 1.6;">
          <h3>Block 4: Final Test</h3>
          <p>In this part, you will see a picture and choose between two forms of the noun.</p>
          <p>Please select the form that best describes the picture.</p>
          <p><em>You will see 24 trials in this block. No feedback will be provided.</em></p>
        </div>
      `,
      choices: ['Begin Block 4'],
      on_finish: function () {
        document.getElementById("progress-container").style.display = "flex";
        updateProgress(4);
      }
    };

    //fetch trial data from static
    fetch('static/items.json')
      .then(response => response.json())
      .then(data => {
        const block1_data = jsPsych.randomization.shuffle(data);

        block1_data.forEach(trial => {
          timeline.push({
            type: jsPsychImageButtonResponse,
            stimulus: 'static/images/' + trial.image,
            stimulus_class: 'stimulus-image',
            prompt: `<p class="artificial-language">${trial.word}${trial.form === "marked" ? "ka" : ""}</p>`,
            choices: ['Next'],
            data: trial
          });
        });
        // jsPsych.run(timeline);

        timeline.push(block2_intro);

        const block2_data = jsPsych.randomization.shuffle(data);

        block2_data.forEach(trial => {

          const correct_image = trial.image;
          const correct_category = trial.category;

          const other_trials = data.filter(t => t.category !== correct_category);
          const foil_trial = jsPsych.randomization.sampleWithoutReplacement(other_trials, 1)[0];
          const foil_image = foil_trial.image

          //random left or right
          const left_is_correct = Math.random() < 0.5;
          correct_response: left_is_correct ? 0 : 1;


          const left_image = left_is_correct ? correct_image : foil_image;
          const right_image = left_is_correct ? foil_image : correct_image;

          timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
            <div style="text-align: center;">
              <p style="font-size: 22px; margin-bottom: 30px;">${trial.sentence}</p>
              <div style="display: flex; justify-content: center; gap: 60px;">
                
                <!-- left image -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div style="width: 35vw; height: 35vw; display: flex; align-items: center; justify-content: center;">
                    <img id="left-img"
                        src="static/images/${left_image}"
                        style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: pointer;">
                  </div>
                  <div id="left-feedback" style="font-size: 32px; height: 40px; margin-top: 10px;"></div>
                </div>

                <!-- right image -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div style="width: 35vw; height: 35vw; display: flex; align-items: center; justify-content: center;">
                    <img id="right-img"
                        src="static/images/${right_image}"
                        style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: pointer;">
                  </div>
                  <div id="right-feedback" style="font-size: 32px; height: 40px; margin-top: 10px;"></div>
                </div>

              </div>
            </div>
            `,
            choices: "NO_KEYS",  
            on_load: function() {
              let responded = false;
              const correct = left_is_correct ? 0 : 1;

              function giveFeedback(chosen) {
                if (responded) return;
                responded = true;

                const leftBox = document.getElementById("left-feedback");
                const rightBox = document.getElementById("right-feedback");

                if (chosen === 0) {
                  leftBox.textContent = correct === 0 ? "✅" : "❌";
                  rightBox.textContent = correct === 1 ? "✅" : "";
                } else {
                  rightBox.textContent = correct === 1 ? "✅" : "❌";
                  leftBox.textContent = correct === 0 ? "✅" : "";
                }

                // stop click again 
                document.getElementById("left-img").style.pointerEvents = "none";
                document.getElementById("right-img").style.pointerEvents = "none";

                // click anywhere to continue
                setTimeout(() => {
                  document.body.addEventListener("click", () => {
                    jsPsych.finishTrial({ response: chosen });
                  }, { once: true });
                }, 200);
              }

              document.getElementById("left-img").addEventListener("click", () => giveFeedback(0));
              document.getElementById("right-img").addEventListener("click", () => giveFeedback(1));
            },
            data: {
              sentence: trial.sentence,
              correct_response: left_is_correct ? 0 : 1,
              correct_image: correct_image,
              foil_image: foil_image,
              left_image: left_image,
              right_image: right_image
            },
            on_finish: function(data) {
              data.response_side = data.response === 0 ? "left" : "right";
              data.correct = data.response === data.correct_response;
            }
          });
        })

        timeline.push(block3_intro)

        const block3_data = jsPsych.randomization.shuffle(data);

        // categories of sentences
        const categories = {};

        // initialize categories
        block3_data.forEach(trial => {
          if (!categories[trial.category]) {
            categories[trial.category] = [];
          }
          categories[trial.category].push(trial);
        });

        // shuffle individual categories
        for (let cat in categories) {
          categories[cat] = jsPsych.randomization.shuffle(categories[cat]);
        }

        // match correct sentence and foil sentence
        const categoryNames = Object.keys(categories);
        const numCategories = categoryNames.length;

        // save sentence pairs
        const block3_trials = [];

        // determine foil sentences
        for (let i = 0; i < numCategories; i++) {
          const currentCategory = categoryNames[i];
          const foilCategory = categoryNames[(i + 1) % numCategories]; 

          for (let j = 0; j < categories[currentCategory].length; j++) {
            const correctTrial = categories[currentCategory][j];
            const foilTrial = categories[foilCategory][j]; 

            // random position (right or left)
            const left_is_correct = Math.random() < 0.5;

            block3_trials.push({
              correct_sentence: correctTrial.sentence,
              correct_category: correctTrial.category,
              correct_image: correctTrial.image,
              foil_sentence: foilTrial.sentence,
              foil_category: foilTrial.category,
              foil_image: foilTrial.image,
              correct_response: left_is_correct ? 0 : 1, // 0 is left and 1 is right
            });
          }
        }

        block3_trials.forEach(trial => {

          const left_is_correct = trial.correct_response === 0;
          const left_sentence = left_is_correct ? trial.correct_sentence : trial.foil_sentence;
          const right_sentence = left_is_correct ? trial.foil_sentence : trial.correct_sentence;

          timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
              <div style="text-align: center;">
                <!-- 图片区域 -->
                <div style="width: 35vw; height: 35vw; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <img src="static/images/${trial.correct_image}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>

                <!-- 句子 + 反馈区域 -->
                <div style="display: flex; justify-content: center; gap: 100px; margin-top: 40px;">
                  <!-- 左 -->
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <button id="left-sent" class="jspsych-btn" style="font-size: 18px; margin-bottom: 10px;">${left_sentence}</button>
                    <div id="left-feedback" style="font-size: 28px; height: 32px;"></div>
                  </div>
                  <!-- 右 -->
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <button id="right-sent" class="jspsych-btn" style="font-size: 18px; margin-bottom: 10px;">${right_sentence}</button>
                    <div id="right-feedback" style="font-size: 28px; height: 32px;"></div>
                  </div>
                </div>
              </div>
            `,
            choices: "NO_KEYS",
            on_load: function () {
              let responded = false;
              const correct = trial.correct_response;

              const leftBtn = document.getElementById("left-sent");
              const rightBtn = document.getElementById("right-sent");
              const leftBox = document.getElementById("left-feedback");
              const rightBox = document.getElementById("right-feedback");

              function giveFeedback(choice) {
                if (responded) return;
                responded = true;

                const leftBox = document.getElementById("left-feedback");
                const rightBox = document.getElementById("right-feedback");

                if (choice === 0) {
                  leftBox.textContent = correct === 0 ? "✅" : "❌";
                  rightBox.textContent = correct === 1 ? "✅" : "";
                } else {
                  rightBox.textContent = correct === 1 ? "✅" : "❌";
                  leftBox.textContent = correct === 0 ? "✅" : "";
                }

                // ✅ 允许点击任意区域继续
                setTimeout(() => {
                  document.body.addEventListener("click", () => {
                    jsPsych.finishTrial({ response: choice });
                  }, { once: true });
                }, 200);
              }

              leftBtn.addEventListener("click", () => giveFeedback(0));
              rightBtn.addEventListener("click", () => giveFeedback(1));
            },
            data: {
              image: trial.correct_image,
              correct_response: trial.correct_response,
              correct_sentence: trial.correct_sentence,
              foil_sentence: trial.foil_sentence,
              left_sentence: left_sentence,
              right_sentence: right_sentence
            },
            on_finish: function(data) {
              data.response_side = data.response === 0 ? "left" : "right";
              data.correct = data.response === data.correct_response;
            }
          });

        });

        timeline.push(block4_intro)

        // Block 4
        const block4_data = jsPsych.randomization.shuffle(data);

        block4_data.forEach(trial => {
          // random position
          const word_on_left = Math.random() < 0.5;
        
          // 设置按钮选项
          const word_choice = trial.word;
          const word_ka_choice = trial.word + "ka";
          const choices = word_on_left ? [word_choice, word_ka_choice] : [word_ka_choice, word_choice];

          timeline.push({
            type: jsPsychImageButtonResponse,
            stimulus: 'static/images/' + trial.image,
            stimulus_class: 'stimulus-image',
            choices: choices,
            data: {
              image: trial.image,
              category: trial.category,
              word: trial.word,
              actual_form: trial.form, // "marked" or "bare"
              actual_number: trial.form === "marked" ? "plural" : "singular",
              word_on_left: word_on_left,
              word_choice: word_choice,
              word_ka_choice: word_ka_choice
            },
            on_finish: function(data) {
              // record user choice 
              data.user_choice = (data.response === 0) ? 
                (data.word_on_left ? "word" : "wordka") : 
                (data.word_on_left ? "wordka" : "word");
              data.correct = data.response === data.correct_response;
            }
          });
        
        });

        // End of Experiment
        const experiment_end = {
          type: jsPsychHtmlButtonResponse,
          stimulus: `
            <div style="max-width: 700px; margin: 0 auto; text-align: center; line-height: 1.6; font-size: 18px;">
              <h2>Experiment Complete</h2>
              
              <p>Thank you for participating in this language learning experiment!</p>
              
              <p>You have successfully completed all blocks of the study. Your responses have been recorded and will contribute to our research on artificial language acquisition.</p>
              
              <p>If you have any questions about this study, please feel free to contact us at: <a href="mailto:S.Sun-46@sms.ed.ac.uk">S.Sun-46@sms.ed.ac.uk</a></p>
              
              <p><strong>You may now close this window.</strong></p>
            </div>
          `,
          choices: ["Finish"]
        };

        timeline.push(experiment_end);
        
      })
      .catch(err => {
        console.error("Failed to load items.json", err);
        alert("Error loading experiment materials");
      })

    /* start the experiment */
    jsPsych.run(timeline);
