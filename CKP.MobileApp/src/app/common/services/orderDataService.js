
'use strict';

app.factory("orderDataService", [
                "$http", "$q", "localStorageService", "ngAuthSettings", "authService", "$rootScope",
                function ($http, $q, localStorageService, ngAuthSettings, authService, $rootScope) {
                    var orderDataServiceFactory = {};
                    var date = kendo.toString(new Date(), "yyyy-MM-dd");
                    
                    var getOrderDetail = function (poctrlno) {
                   
                        var deferred = $q.defer();

                        var authServiceBase = ngAuthSettings.authServiceBaseUri;

                        var orgContext = '';
                        var organizationDetail = localStorageService.get('organizationDetail');

                        if (organizationDetail) {
                            orgContext = organizationDetail;
                        }

                        var jsonIn = {
                            ProductionOrderId: poctrlno,
                            OrganizationDetail: orgContext
                        }
                        
                        console.log(jsonIn);
                        var url = authServiceBase + "webapi/api/core/MobileApp/GetOrderDetailByPOCtrlNo";

                     
                        $http.post(url, jsonIn).success(function (result) {
                      
                            deferred.resolve(result);
                        }).error(function (xhr, status, error) {
                           
                            deferred.reject(error);
                        });
                        return deferred.promise;
                    };
             
                    var getOrderList = function (jsonIn) {
                        var deferred = $q.defer();
                        var authServiceBase = ngAuthSettings.authServiceBaseUri;

                        var authData = authService.getUserInfo();
                        var userId = authData.userId;
                        var orgContext = '';
                        var organizationDetail = localStorageService.get('organizationDetail');
                     
                        jsonIn.UserId = organizationDetail.UserId;
                       
                                         
                        var url = authServiceBase + "webapi/api/core/MobileApp/GetOrderList";
                                             
                        $http.post(url, jsonIn).success(function (result) {
                            localStorageService.set('orderList' + date, result);
                            deferred.resolve(result);
                        }).error(function (xhr, status, error) {  
                            
                            deferred.reject(error);
                        });
                        return deferred.promise;
                    };
                
                    var approveDecline = function (jsonIn) {
                        var deferred = $q.defer();
                        var authServiceBase = ngAuthSettings.authServiceBaseUri;
                                              
                        var orgContext = '';
                        var organizationDetail = localStorageService.get('organizationDetail');
                                                
                        jsonIn.OrgDetail = organizationDetail;
                     
                        var url = authServiceBase + "webapi/api/core/MobileApp/UpdateApproveOrderStatus";
                       
                        var data = {
                            UpdateStatus: jsonIn.UpdateStatus,
                            OrgDetail: organizationDetail,
                            ApproveOrdersListData: jsonIn.Salesorders
                        }

                      
                        $http.post(url, data).success(function (result) {
                            $rootScope.hasSearchOrApporval = true;
                            deferred.resolve(result);
                        }).error(function (xhr, status, error) {                           
                            deferred.reject(error);
                        });
                        return deferred.promise;
                    };

                    var getConfirmationHtml = function (id) {
                        var deferred = $q.defer();
                       
                        var orgContext = '';
                        var organizationDetail = localStorageService.get('organizationDetail');

                        if (organizationDetail) {
                            orgContext = organizationDetail.OrgContext;
                        }

                        var data = {
                            OrgContext: orgContext,
                            ShoppingCartId: id
                        };
                      
                        var url = authServiceBase + "webapi/api/core/MobileApp/GetConfirmationHtml";
                        $http.post(url, data).then(
                            function successCallback(result) {
                                deferred.resolve(result);
                            }, function errorCallback(error) {
                                deferred.reject(error);
                            });

                      
                        return deferred.promise;
                    };

                    orderDataServiceFactory.approveDecline = approveDecline;
                    
                    orderDataServiceFactory.getOrderDetail = getOrderDetail;
                                     
                    orderDataServiceFactory.getConfirmationHtml = getConfirmationHtml;

                    orderDataServiceFactory.getOrderList = getOrderList;
                   
                    return orderDataServiceFactory;
                }
            ]);