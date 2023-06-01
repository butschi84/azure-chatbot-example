// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { CardFactory } = require('botbuilder-core');
const { DialogBot } = require('./dialogBot');
const WelcomeCard = require('../../resources/welcomeCard.json');
const { Activity, ActivityHandler, ActivityTypes, Mention, TurnContext} =require('botbuilder');

class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.onMessage(async (context, next) => {
            if(context.activity.channelId === "msteams") {
                // Send a message with an @Mention
                await this._messageWithMention(context);
            }else{
                await context.sendActivity(`You said '${ context.activity.text } (${context.activity.channelId})'`);
            }

            // By calling next you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
                    await context.sendActivity({ attachments: [welcomeCard] });
                    await dialog.run(context, conversationState.createProperty('DialogState'));
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        
    }

    async _messageWithMention(context){
        // Create mention object
        const mention = {
            mentioned: context.activity.from,
            text: `<at>${context.activity.from.name}</at>`,
            type: 'mention'
        };
    
        context.activity.text = context.activity.text.replace(/<at>Test Chatbot<\/at>/i, "")
        // console.log(JSON.stringify(context.activity))

        // Construct message to send
        const message = {
            entities: [mention],
            text: `${mention.text} You said '${ context.activity.text }'`,
            type: ActivityTypes.Message
        };
    
        // Send the message with @mention
        await context.sendActivity(message);
    }
}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
