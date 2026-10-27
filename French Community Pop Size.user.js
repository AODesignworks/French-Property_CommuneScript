// ==UserScript==
// @name     French Community Pop Size
// @version  1
// @description Shows the population of different communities in france on french-property.com
// @match    https://www.french-property.com/*
// @grant    none
// ==/UserScript==

(function () {	
  	'use strict';
  
  	function setCSS(elementTarget, population){
      elementTarget.style.float = 'right';
      elementTarget.style.color = 'white';
      elementTarget.style.fontSize = '1.3em';
      elementTarget.style.paddingLeft = '5px';
      elementTarget.style.paddingRight = '5px';
      elementTarget.style.borderRadius = '5px';
      
      if(population > 100000){
        elementTarget.style.background = 'rgb(0, 204, 0)';
      } else if (population > 50000) {
        elementTarget.style.background = 'rgb(0, 153, 255)';
      } else if (population > 10000) {
        elementTarget.style.background = 'rgb(0, 0, 0)';
      } else {
        elementTarget.style.background = 'rgb(255, 102, 102)';
      }
    };
  
  	function showCommunePop() {
      document.querySelectorAll('span').forEach(a => {
//         var popDisplay = document.createTextNode('');
        var popDisplay = document.createElement('DIV');
        popDisplay.className = 'notFound';
        if(a.classList.contains('commune')){
          const nodeList = a.childNodes;
          var communeInfo = nodeList[1].textContent;
          
          var postalCodeIndex = communeInfo.indexOf(', ');
          var codePostal = communeInfo.substr(postalCodeIndex + 2);
          var commune = communeInfo.substr(0,postalCodeIndex);
          
          var apiUrl = ("https://geo.api.gouv.fr/communes?codePostal=" + codePostal);
          var population = 'Not Found';

          fetch(apiUrl)
            .then(response => {
              if (!response.ok) {
                  throw new Error('Bad Response');
              }
            return response.json();
          })
          .then(data => {
            data.forEach((returnedCommune) => {
              if(returnedCommune.nom == commune){
                population = returnedCommune.population;
                popDisplay.textContent = 'Pop: ' + population;
                
								setCSS(popDisplay, population);
              }
            })
          })
          .catch(error => {
            console.error('Error', error);
          });
          
        	a.appendChild(popDisplay);
        }
      });
  	}
    showCommunePop();
})();