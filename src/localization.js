(function(jQuery) {
  "use strict";

  function normalizeLanguage(language) {
    var match = language.match(/([A-Za-z]+)-([A-Za-z]+)/);
    if (match)
      return match[1].toLowerCase() + "-" + match[2].toUpperCase();
    return language;
  }
  
  jQuery.localization = {
    extend: function extend(language, scope, obj) {
      language = normalizeLanguage(language);
      if (!(language in this))
        this[language] = {};
      for (var name in obj)
        this[language][scope + ":" + name] = obj[name];
    },
    createLocale: function createLocale(languages) {
      // We especially want to do this in the case where the client
      // is just passing in navigator.language, which is all lowercase
      // in Safari.
      languages = languages.map(normalizeLanguage);

      var locale = {
        languages: languages,
        get: function get(scopedName) {
          return locale[scopedName] || "unable to find locale string " + 
                 scopedName;
        },
        scope: function scope(scope) {
          return function(name) {
            return locale.get(scope + ":" + name);
          }
        }
      };
      
      languages.forEach(function(language) {
        if (language in jQuery.localization)
          jQuery.extend.call(locale, jQuery.localization[language]);
      });
      
      return locale;
    },
    init: function init(languages) {
      jQuery.locale = this.createLocale(languages);
    }
  };
  
  jQuery.localization.init([]);
})(jQuery);
