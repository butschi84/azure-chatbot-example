// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ConfirmPrompt, TextPrompt, WaterfallDialog, ChoicePrompt } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CHOICE_PROMPT = 'choicePrompt';

class IntentDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'intentDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.intentStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * ask for initial intent
     * order: food or beverage
     */
    async intentStep(stepContext) {
        const intentDetails = stepContext.options;

        intentDetails.intent = stepContext.result;

        if (!intentDetails.intent) {
            const messageText = 'Would you like to order food or beverages?';
            const intentChoices = ['food', 'beverage'];
            return await stepContext.prompt(CHOICE_PROMPT, messageText, intentChoices);
        }
        
            return await stepContext.next(intentDetails.intent);
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        const intentDetails = stepContext.options;
        intentDetails.intent = stepContext.result.value;
        return await stepContext.endDialog(intentDetails);
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.IntentDialog = IntentDialog;
