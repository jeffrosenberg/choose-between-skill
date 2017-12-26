const chai = require("chai");
const expect = chai.expect;
var index = require("../src/index");

const context = require("aws-lambda-mock-context");
const ctx = context();

// Test template via:
// https://medium.com/front-end-hacking/alexa-how-to-unit-test-your-skill-locally-236b1f01d001

describe("ChoiceIntent", function() {
  var resp = null;
  var speechError = null;

  // Fires once for the group of tests, done is mocha's callback to 
  // let it know that an   async operation has completed before running the rest 
  // of the tests, 2000ms is the default timeout though
  before(function(done){
    //This fires the event as if a Lambda call was being sent in
    index.handler({
      "session": {
        "new": true,
        "sessionId": "SessionId.95a84ab0-8dbe-4de0-966b-ddf401de9495",
        "application": {
          "applicationId": "amzn1.ask.skill.6eebd8dd-2062-4666-9040-34d103d114c7"
        },
        "attributes": {},
        "user": {
          "userId": "amzn1.ask.account.AEY2OE6MK7XVIW7TMSPZNBVKKGSHDROXT5BAJSYT3U6KBSMVFQSEIHB6SB6BSQR67YX7UWU5NJ5C3HF5LDQ26DKQJKQDFGXYTN77URTIUQFEBW3MQAPEUX43GM3PVRR23QWGMVMD2ASTKPL6PVOO5BEUH2CYUDMT45ZAGE4XFC52CUKUBMR7HPKQXAPUHIVGQ3ARVZZASI6BO4A"
        }
      },
      "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.693c5b43-f9cf-4d19-bbea-c183eb59e6f8",
        "intent": {
          "name": "Choice",
          "slots": {
            "Kid": {
              "name": "Kid"
            }
          }
        },
        "locale": "en-US",
        "timestamp": "2017-12-24T23:14:33Z"
      },
      "context": {
        "AudioPlayer": {
          "playerActivity": "IDLE"
        },
        "System": {
          "application": {
            "applicationId": "amzn1.ask.skill.6eebd8dd-2062-4666-9040-34d103d114c7"
          },
          "user": {
            "userId": "amzn1.ask.account.AEY2OE6MK7XVIW7TMSPZNBVKKGSHDROXT5BAJSYT3U6KBSMVFQSEIHB6SB6BSQR67YX7UWU5NJ5C3HF5LDQ26DKQJKQDFGXYTN77URTIUQFEBW3MQAPEUX43GM3PVRR23QWGMVMD2ASTKPL6PVOO5BEUH2CYUDMT45ZAGE4XFC52CUKUBMR7HPKQXAPUHIVGQ3ARVZZASI6BO4A"
          },
          "device": {
            "supportedInterfaces": {}
          }
        }
      },
      "version": "1.0"
    },ctx);

    //Captures the response and/or errors
    ctx.Promise
        .then(r => { resp = r; done(); })
        .catch(err => { speechError = err; done();})
    });

    describe("The response is structurally correct for Alexa Speech Services", function() {
      it("should not have errored",function() {
        expect(speechError).to.be.null
      });

      it("should have a spoken response", () => {
        expect(resp.response.outputSpeech).not.to.be.null
      });

      it("should display a card", () => {
        expect(resp.response.card).not.to.be.null
      });
    });

    describe("The response returns expected values", function() {
      it("should return 'Tegan' or 'Aaron' as output speech",function() {
          expect(resp.response.outputSpeech.ssml).to.be.oneOf(["<speak> I chose: Aaron </speak>", "<speak> I chose: Tegan </speak>"])
      });

      it("should return 'Tegan' or 'Aaron' as card content",function() {
          expect(resp.response.card.content).to.be.oneOf(["Tegan", "Aaron"])
      });
    });
});
