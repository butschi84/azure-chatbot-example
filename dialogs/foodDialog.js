// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog, ChoicePrompt } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const getMeal = require("../services/foodDB")

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CHOICE_PROMPT = 'choicePrompt';

class FoodDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'foodDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.foodStep.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async foodStep(stepContext) {
        const foodOrderDetails = stepContext.options;

        foodOrderDetails.mealtype = stepContext.result;

        if (!foodOrderDetails.mealtype) {
            const messageText = 'Would you like to eat a vegetarian meal or with meat?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        
            return await stepContext.next(foodOrderDetails.mealtype);
    }

    async confirmStep(stepContext) {
        const foodOrderDetails = stepContext.options;

        // Capture the results of the previous step
        foodOrderDetails.kind = stepContext.result;

        switch(foodOrderDetails.kind) {
            case "vegetarian":
                foodOrderDetails.meal = getMeal(true)
                break
            default:
                foodOrderDetails.meal = getMeal()
                break
        }

        const messageText = `How about: ${foodOrderDetails.meal} as a ${foodOrderDetails.kind} meal?`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const bookingDetails = stepContext.options;
            return await stepContext.endDialog(bookingDetails);
        }
        return await stepContext.endDialog();
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.FoodDialog = FoodDialog;
