const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'ote3m_iJZjEegRcWvOBFiCTEy2bFywLYUDa4zW2xZpRt',
  }),
  serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/67c567ff-f0c1-4b91-a852-08fb1428ad99',
});

const translateParams = {
  text: 'Hello, how are you today?',
  modelId: 'en-es',
};


/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back
      languageTranslator.translate(translateParams)
      .then(translationResult => {
        console.log(JSON.stringify(translationResult, null, 2));
        //console.log(translationResult.translations[0]);
        resolve({
          statusCode: 200,
          body: {
            translations: translationResult.result.translations[0].translation,
            words: translationResult.result.translations[0].word_count,
            characters: translationResult.result.translations[0].character_count,
          },
          headers: { 'Content-Type': 'application/json' }
        });
      })
      .catch(err => {
        console.log('error:', err);
      });


         
    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}