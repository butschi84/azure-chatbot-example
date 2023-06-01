// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog, ChoicePrompt } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const CHOICE_PROMPT = 'choicePrompt';

class BeverageDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'beverageDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.beverageStep.bind(this),
                this.kindStep.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async beverageStep(stepContext) {
        const beverageOrderDetails = stepContext.options;

        beverageOrderDetails.beverage = stepContext.result;

        if (!beverageOrderDetails.beverage) {
            const messageText = 'Which beverage would you like to drink? (cola / water)';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        
            return await stepContext.next(beverageOrderDetails.beverage);
        

    }

    async kindStep(stepContext) {
        const beverageOrderDetails = stepContext.options;
        beverageOrderDetails.beverage = stepContext.result;

        let messageText = "";
        let msg = null

        if(!["cola", "water"].includes(beverageOrderDetails.beverage)) {
            messageText = `i dont know ${beverageOrderDetails.beverage}. Please choose again`;
            msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            await stepContext.context.sendActivity(messageText, messageText, InputHints.IgnoringInput);
            return false
        }

        if (!beverageOrderDetails.kind) {
            switch(beverageOrderDetails.beverage) {
                case "cola":
                    const colaChoices = ['cola zero', 'cola original'];
                    return await stepContext.prompt(CHOICE_PROMPT, 'Cola zero or cola original?', colaChoices);
                case "water":
                    messageText = 'still or sparkling?';
                    msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                    return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
            }
        }
        return await stepContext.next(beverageOrderDetails.kind);
    }

    async confirmStep(stepContext) {
        const beverageOrderDetails = stepContext.options;
        // Capture the results of the previous step
        beverageOrderDetails.kind = stepContext.result.value ? stepContext.result.value : stepContext.result;

        let messageText = "";
        let msg = null

        if(beverageOrderDetails.beverage === "water" & !["sparkling", "still"].includes(beverageOrderDetails.kind)) {
            messageText = `i dont know ${beverageOrderDetails.kind}. Please choose again`;
            msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.context.sendActivity(messageText, messageText, InputHints.IgnoringInput);
            return false
        }

        messageText = `A ${beverageOrderDetails.beverage} (${beverageOrderDetails.kind}) it is`;
        msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

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

module.exports.BeverageDialog = BeverageDialog;
