function bananaRequiredVersion(requiredVersion, expmVersion) {

  var language = "en";
  if (Banana.document.locale) {
    language = Banana.document.locale;
  }
  if (language.length > 2) {
    language = language.substr(0, 2);
  }
  if (expmVersion) {
    requiredVersion = requiredVersion + "." + expmVersion;
  }
  if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) < 0) {
    var msg = "";
    switch(language) {
      
      case "en":
        if (expmVersion) {
          msg = "This script does not run with this version of Banana Accounting. Please update to Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "This script does not run with this version of Banana Accounting. Please update to version " + requiredVersion + " or later.";
        }
        break;

      case "it":
        if (expmVersion) {
          msg = "Lo script non funziona con questa versione di Banana Contabilità. Aggiornare a Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "Lo script non funziona con questa versione di Banana Contabilità. Aggiornare alla versione " + requiredVersion + " o successiva.";
        }
        break;
      
      case "fr":
        if (expmVersion) {
          msg = "Ce script ne fonctionne pas avec cette version de Banana Comptabilité. Veuillez mettre à jour à Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "Ce script ne fonctionne pas avec cette version de Banana Comptabilité. Veuillez mettre à jour à la version " + requiredVersion + " ou plus récente.";
        }
        break;
      
      case "de":
        if (expmVersion) {
          msg = "Dieses Skript läuft nicht mit dieser Version von Banana Buchhaltung. Bitte aktualisieren Sie auf Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "Dieses Skript läuft nicht mit dieser Version von Banana Buchhaltung. Bitte aktualisieren Sie auf Version " + requiredVersion + " oder höher.";
        }
        break;
      
      case "nl":
        if (expmVersion) {
          msg = "Dit script draait niet met deze versie van Banana Accounting. Gelieve bij te werken naar Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "Dit script draait niet met deze versie van Banana Boekhouding. Gelieve bij te werken naar " + requiredVersion + " versie of later.";
        }
        break;
      
      case "zh":
        if (expmVersion) {
          msg = "此脚本不适用于此版本的Banana Accounting。 请更新到Banana Experimental ("+ requiredVersion +")。";
        } else {
          msg = "此脚本不适用于此版本的Banana Accounting。 请更新为 "+ requiredVersion +" 版本或更高版本。";
        }
        break;
      
      case "es":
        if (expmVersion) {
          msg = "Este script no se ejecuta con esta versión de Banana Accounting. Por favor, actualice a Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "Este script no se ejecuta con esta versión de Banana Contabilidad. Por favor, actualice a la versión " + requiredVersion + " o posterior.";
        }
        break;
      
      case "pt":
        if (expmVersion) {
          msg = "Este script não é executado com esta versão do Banana Accounting. Por favor, atualize para Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "Este script não é executado com esta versão do Banana Contabilidade. Por favor, atualize para a versão " + requiredVersion + " ou posterior.";
        }
        break;
      
      default:
        if (expmVersion) {
          msg = "This script does not run with this version of Banana Accounting. Please update to Banana Experimental (" + requiredVersion + ").";
        } else {
          msg = "This script does not run with this version of Banana Accounting. Please update to version " + requiredVersion + " or later.";
        }
    }

    Banana.application.showMessages();
    Banana.document.addMessage(msg);

    return false;
  }
  return true;
}