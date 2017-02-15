// declare a module
var app = angular.module('app', [ 'ui.router', 'ngCookies', 'pascalprecht.translate', 'tmh.dynamicLocale']);

app.constant('LOCALES', {
    'locales': {
        'es': 'Español',
        'en': 'English'
    },
    'preferredLocale': 'en'
});
//
app.config(function ($translateProvider) {
    $translateProvider.useMissingTranslationHandlerLog();
});

app.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('scripts/angular-locale_{{locale}}.js');
});
//
app.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('en');// is applied on first load
    $translateProvider.useLocalStorage();// saves selected language to localStorage
});

app.controller('MainController', ['$scope', '$http', 'LocaleService', '$translate', function($scope, $http, LocaleService, $translate) {
  $scope.languages = LocaleService.getLocalesDisplayNames()

  $scope.selectedLanguage = LocaleService.getLocaleDisplayName()

  $scope.send = function(name, email, message){
    if(!name || !email || !message){
      $translate('alert.form-invalid').then(function (text) {
        showNotification(text, 'danger')
      });
      return
    }

    var defaultForm = {
      user: "",
      email: "",
      message: ""
    }

    $scope.isLoading = true;

    $http.post('/sendmail', {
      from: email,
      subject: 'Apps Boulevard Website',
      text: message
    }).then(function(res){
      $scope.isLoading = false;
      $scope.user = angular.copy(defaultForm);
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $translate('alert.success').then(function (text) {
        showNotification(text, 'success')
      });
    }, function(err){
      console.error(err)
      $scope.isLoading = false;
      $translate('alert.error').then(function (text) {
        showNotification(text, 'danger')
      });
    });
  }

  $scope.closeNav = function(section){
    if(section){
      // $.fn.fullpage.moveTo(section, 0);
      $('html, body').animate({
        scrollTop: $("#section-" + section).offset().top
    }, 500);
    }
    document.getElementById("mySidenav").style.left = "-100%";
  }

  $scope.openNav = function(){
    document.getElementById("mySidenav").style.left = "0";
  }

  $scope.closeLanguages = function(lang){
    if(lang){
      LocaleService.setLocaleByDisplayName(lang)
      $scope.selectedLanguage = LocaleService.getLocaleDisplayName()
    }

    // $('#menuLanguages').fadeOut('fast')
    $('#accordion').slideUp()

  }

  // $scope.openLanguages = function(){
  //   $('#menuLanguages').fadeIn('fast')
  // }

  $scope.openLanguages = function(){
    event.stopPropagation()
    $('#accordion').slideToggle()
  }

  var showNotification = function(message, type){
    $.notify({
    	message: message
    },{
    	type: type,
    });
  }
}]);

app.service('LocaleService', function ($translate, LOCALES, $rootScope, tmhDynamicLocale) {
    'use strict';
    // PREPARING LOCALES INFO
    var localesObj = LOCALES.locales;

    // locales and locales display names
    var _LOCALES = Object.keys(localesObj);
    if (!_LOCALES || _LOCALES.length === 0) {
      console.error('There are no _LOCALES provided');
    }
    var _LOCALES_DISPLAY_NAMES = [];
    _LOCALES.forEach(function (locale) {
      _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
    });

    // STORING CURRENT LOCALE
    var currentLocale = $translate.proposedLanguage();// because of async loading

    // METHODS
    var checkLocaleIsValid = function (locale) {
      return _LOCALES.indexOf(locale) !== -1;
    };

    var setLocale = function (locale) {
      if (!checkLocaleIsValid(locale)) {
        console.error('Locale name "' + locale + '" is invalid');
        return;
      }
      currentLocale = locale; // updating current locale

      // asking angular-translate to load and apply proper translations
      $translate.use(locale);
    };

    // EVENTS
    // on successful applying translations by angular-translate
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html

       // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });

    return {
      getLocaleDisplayName: function () {
        return currentLocale;
      },
      setLocaleByDisplayName: function (localeDisplayName) {
        setLocale(
          _LOCALES[
            _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName)// get locale index
            ]
        );
      },
      getLocalesDisplayNames: function () {
        return _LOCALES_DISPLAY_NAMES;
      }
    };
});

app.directive('ngTranslateLanguageSelect', function (LocaleService) {
  'use strict';
  return {
      restrict: 'A',
      replace: true,
      template: ''+
      '<div class="language-select" ng-if="visible">'+
          '<label>'+
              '<div translate="directives.language-select.Language"></div>:'+
              '<select ng-model="currentLocaleDisplayName"'+
                  'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"'+
                  'ng-change="changeLanguage(currentLocaleDisplayName)">'+
              '</select>'+
          '</label>'+
      '</div>'+
      '',
      controller: function ($scope) {
          $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
          $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
          $scope.visible = $scope.localesDisplayNames &&
          $scope.localesDisplayNames.length > 1;

          $scope.changeLanguage = function (locale) {
              LocaleService.setLocaleByDisplayName(locale);
          };
      }
  };
});
