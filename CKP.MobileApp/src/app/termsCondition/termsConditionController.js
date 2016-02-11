
app.controller('termsConditionController', [
                   '$scope', '$http', '$sce', 'policyTermsDataService', 'translateService',
                   function ($scope, $http, $sce, policyTermsDataService, translateService) {
                       if (typeof (window.navigator.simulator) === 'undefined' && window.navigator.platform !== 'iPhone') {
                           window.plugins.EqatecAnalytics.Monitor.TrackFeature("view.termsCondition");
                       }
                       $scope.form = {};
                       $scope.form.title = {};
                       $scope.form.title.resoruceName = "Terms & Conditions";
                       $scope.form.title.resoruceValue = translateService.getResourceValue($scope.form.title.resoruceName);

                       var setResources = function () {
                           $scope.form.noData = {};
                           $scope.form.noData.resoruceName = "No Data are found";
                           $scope.form.noData.resoruceValue = translateService.getResourceValue($scope.form.noData.resoruceName);
                       }
                       setResources();

                       $scope.afterShow = function (e) {

                           var view = kendo.mobile.application.view();
                           if (view !== null) {
                               var navbar = kendo.mobile.application.view()
                                            .header
                                            .find(".km-navbar")
                                            .data("kendo-mobile-nav-bar");
                               navbar.title($scope.form.title.resoruceValue);

                           }
                       }


                       $scope.termsCondition = {};
                       var init = function () {
                           kendo.mobile.application.pane.loader.show();
                           policyTermsDataService.getPolicyTerms().then(function (result) {
                               $scope.termsCondition = result;

                           }).catch(function (error) {
                               $scope.termsCondition = {};
                           }).finally(function () {
                               kendo.mobile.application.pane.loader.hide();
                           });
                       }
                       init();
                       $scope.renderHtml = function (content) {
                           return $sce.trustAsHtml(content);
                       };
                   }
]);