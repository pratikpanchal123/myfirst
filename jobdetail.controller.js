(function () {
    'use strict';
    function jobDetailController(jobDetailFactory, $scope, $uibModal, $uibModalInstance, exceptionFactory, config,
            notification, utilityFactory, loggingFactory, MapServices,
            activeJobDetail, $rootScope, appString, $compile,
            getPaymentInstrument, minimizeJobs, pubnub, user,
            activeJobListDetail, snoozedListDetail, jobDetailList, appGlobals, shareableContent, jobStatus,
            getDisablementReason, isAlertDetail, addJobFactory, partnerConfig, $timeout, $uibModalStack, $interval,
            refundFactory, dataValidationFactory, featureFactory, dispatchUtilityFactory,
            dispatchJobListFactory,providerCostFactory) {

        var _this = this;
        var modalInstanceChangeVehicleLoc, modalInstanceReasonNote,
                modalInstanceCustomSnooze, modalInstanceMessageNotesChat,
                modalInstanceCancelReasonModal, modalInstanceEvetModal, modalInstanceCancelJob,
                modalInstanceUpateTiming, modalInstanceEmailReceiptModal, modalInstanceConfirmAction,
                modalInstanceCustomerPayment, modalInstanceProviderPayment, modalInstanceChangeStatusModal,
                modalInstanceOtherProviderPayment, modalInstanceWorldPayment, modalInstanceRefund, modalInstanceCustomerPrice, modalInstanceUpdateTowingDistance, modalInstanceUpdateVehicle;
        var userData = user.getUserData();
        var markerList = [];
        _this.registrationNumber = "";
        _this.vin = "";
        _this.validRegistrationNumber = true;
        _this.validVin = true;
        _this.isCSR = userData.role === 'CSR';
        _this.isAdmin = userData.role === 'Admin';
        notification.hideLoading();
        _this.snoozes = [{duration: 5 + ' min'}, {duration: 15 + ' min'}, {duration: 60 + ' min'}, {duration: 120 + ' min'}, {duration: 6 + ' hours'}, {duration: 12 + ' hours'}, {duration: 24 + ' hours'}, {duration: 'Custom'}, {duration: 'Completed'}];
        _this.data = activeJobListDetail;
        _this.snoozedData = snoozedListDetail;
        _this.jobList = jobDetailList;
        _this.notes;
        _this.textMsg;
        _this.updateTiming;
        // _this.sendJobInfoToDriver = false;
        _this.sendJobInfoToDriver = false;
        _this.providerAvaliable = [];
        _this.providerCheckOut = [];
        _this.provider = [];
        _this.providerHeader;
        _this.services = [];
        _this.jobEventLog = [];
        _this.startTS;
        _this.isScrollable = true;
        _this.msgList = [];
        _this.jobStatus = [{value: null, visibility: null}];
        _this.driverInfo = [];
        _this.cancelReasonsForCustomer = [];
        _this.potentialReasons = [];
        _this.statusOfJob;
        _this.ExpYear;
        _this.ExpMonth;
        _this.ExpYear;
        _this.Amount;
        _this.paymentMethod;
        _this.ThirdPartyToken;
        _this.selectedTab;
        _this.driverStatusOptions = [];
        _this.selectedDriverStatus;
        _this.internalRecordId;
        _this.selectedEventLogTab;
        _this.updateTimingHeading;
        _this.updateTimingLabel;
        _this.cancelJobCheck;
        _this.isToolTip = false;
        _this.unValidatedRules = [];
        _this.showValidatedCheckbox = [];
        _this.showInValidatedCheckbox = [];
        _this.validationHeader = 'VALIDATE';
        _this.isValidCheckBox = false;
        _this.potentialStatusText = "";
        _this.updatedEstimatedTowMiles = "";
        //  _this.dispatchEvents =[];
        _this.trackingStatus = {status: null, isApp: null, statusNumber: null}
        // _this.dispatchEvents = [{key:1,value:'Estimated Time Of Arrival'},{key:2,value:'Actual Time Of Arrival'}]
//                            {key:3,value:'Provider Assigned'},{key:4,value:'Job Completed'}
        //   _this.selectedDispatchEvent = {key:1,value:'Estimated Time Of Arrival'};
        //_this.dispatchEventToUpdate ;
        _this.dispatchValue;
        // _this.dispatchValue = {date:null,hr:null,min:null}
        // _this.dispatchEventResponse = [];
        _this.etaValue = {value: null, lastUpdatedAt: null};
        _this.ataValue = {value: null, lastUpdatedAt: null};
        _this.actionConfirmed;
        _this.confirmActionHeading;
        _this.confirmActionLabel;
        _this.customerPaymentType;
        _this.customerPrice;
        _this.isThirdPartyPayment = false;
        _this.alertEventLog = [];
        _this.allLog = [];
        _this.cannedMessageList = [];
        _this.selectedCannedMsg;
        _this.otherProviderCost = [];
        _this.selectedOtherProviderCost;
        _this.cannedMsg;
        _this.sendCannedMsg = false;
        _this.validationHistory = [];
        _this.isValidated;
        _this.validatedTimeStamp;
        _this.currentUser = userData.role;
        _this.validatedRules = [];

        _this.otherProviderCostCopy = [];
        _this.initialOtherProviderCostCopy = [];

        _this.customerPaymentTypeSelected;
        _this.serviceProviderCost = {price: null};
        _this.otherProviderPayments = [];
        _this.eventPageOffset = 0;
        _this.eventPageLimit = 20;
        _this.alertPageOffset = 0;
        _this.alertPageLimit = 20;
        _this.allPageOffset = 0;
        _this.allPageLimit = 20;
        _this.dispatchJobAlerts = [];
        _this.alertsLoaded = false;
        _this.jobId = "";
        //initialially get job details of selected job and driver info
        function init() {
            //jobDetailFactory.setCurrentIndex(currentJobIndex);
            _this.isValidEmail = true;
            _this.isPaymentOpen = false;
            _this.isDriverInformationOpen = false;
            _this.isMapOpen = false;
            _this.isProviderPaymentOpen = false;
            _this.isAlertDetail = isAlertDetail;
    _this.manualRuleMapping = [];

//            if(_this.unValidatedRules.length){
//                _this.isValidated = true;
//            }
            // _this.isValidated = true;
            var cancelReasonList = shareableContent.getCancelReasons();
            if (cancelReasonList) {
                config.CANCELREASONS = cancelReasonList;
            }
            _this.potentialReasons = shareableContent.getPotentialReasons();
            if (getDisablementReason.data) {
                config.disablementReason = getDisablementReason.data;
            }
            $scope.$emit('onJobDetailOpen', {jobDetailOpenTime: (new Date())});
            //_this.isChatOpen = activeJobListDetail?activeJobListDetail.isChat?true:false:false;
            _this.editPaymentFlag = false;
            _this.activeJobDetail = activeJobDetail.data[0];
            jobDetailFactory.setActiveJobDetail(_this.activeJobDetail);
            if (_this.activeJobDetail && _this.activeJobDetail.personalInfo && _this.activeJobDetail.personalInfo.phone) {
                _this.activeJobDetail.personalInfo.formattedphone = jobDetailFactory.formatPhoneNumber(_this.activeJobDetail.personalInfo.phone, $rootScope.internationData.countryIsoCode);
            }

            if (_this.activeJobDetail && _this.activeJobDetail.internalInfo && _this.activeJobDetail.internalInfo.disablementReasonId) {
                _this.activeJobDetail.internalInfo.disablementReason = config.disablementReason.filter(function (reason) {
                    if (reason.id === _this.activeJobDetail.internalInfo.disablementReasonId) {
                        return reason;
                    }
                })[0].value;
            }
            if (_this.activeJobDetail && _this.activeJobDetail.provider) {
                _this.activeJobDetail.provider.driverFormattedphone = _this.activeJobDetail.provider.phoneNumber ? jobDetailFactory.formatPhoneNumber(_this.activeJobDetail.provider.phoneNumber, $rootScope.internationData.countryIsoCode) : '';
                _this.activeJobDetail.provider.companyFormattedphone = _this.activeJobDetail.provider.dispatchPhone ? jobDetailFactory.formatPhoneNumber(_this.activeJobDetail.provider.dispatchPhone, $rootScope.internationData.countryIsoCode) : '';
                 _this.dispatchPhone = _this.activeJobDetail.provider.phoneNumber;
            }
            if (_this.activeJobDetail && _this.activeJobDetail.provider && _this.activeJobDetail.provider.status) {
                _this.statusText = jobDetailFactory.returnJobStatus(_this.activeJobDetail.service.status, _this.activeJobDetail.provider.status);
            } else {
                if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.status) {
                    _this.statusText = jobDetailFactory.returnJobStatus(_this.activeJobDetail.service.status);
                }
            }
            if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.status == 200) {
                _this.potentialStatusText = _this.statusText;
                getPotentialsReasonOnly();
            }

            if ($rootScope.internationData.countryIsoCode === 'AU') {
                if (_this.activeJobDetail && _this.activeJobDetail.provider) {
                    if (_this.activeJobDetail.provider.status === 1102) {
                        _this.cancelJobAsOnSite = true;
                    }
                }
            }
            if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.status) {
                _this.isCancelJob = _this.cancelJobAsOnSite || _this.activeJobDetail.service.status === 8 || _this.activeJobDetail.service.status === 9 || _this.activeJobDetail.service.status === 21 || _this.activeJobDetail.service.status === 22 || _this.activeJobDetail.service.status === 24 || _this.activeJobDetail.service.status === 28 || _this.activeJobDetail.service.status === 200 || _this.activeJobDetail.service.status === 102 || (_this.activeJobDetail.service.status > 90 && _this.activeJobDetail.service.status <= 100 && _this.activeJobDetail.service.status != 93);// eslint-disable-line
            }
             if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.id) {
        _this.jobId =  _this.activeJobDetail.service.id;
      }
            // _this.cancelJobAsOnSite = _this.activeJobDetail.provider ? (_this.activeJobDetail.provider.status === 1102 ? true : false) : '';
            //_this.assignedCsr = getAssignedCsr && getAssignedCsr.data && getAssignedCsr.data.length ? getAssignedCsr.data[0] : null;
            _this.paymentInstrument = getPaymentInstrument ? getPaymentInstrument.data[0] : '';
            /*if (getAssignedCsr && getAssignedCsr.data) {
                getPeerList ? getPeerList.data.push(getAssignedCsr.data[0]) : '';
            }*/
            //_this.peersList = getPeerList ? getPeerList.data : '';
            _this.chatSummary = [];
            _this.chatSummaryUnread = [];
            _this.autocompleteOptions = {
                types: []
            };
            /*if(partnerConfig.client === 'US'){
             _this.autocompleteOptions.componentRestrictions.country = 'us';
             } else if(partnerConfig.client === 'US'){
             _this.autocompleteOptions.componentRestrictions.country = 'uk';
             } else if(partnerConfig.client === 'AUS'){
             _this.autocompleteOptions.componentRestrictions.country = 'au'
             }*/

//            if (_this.activeJobDetail && _this.activeJobDetail.provider && _this.activeJobDetail.provider.costs) {
//                _this.otherProviderPayments = [];
//                var otherProviderCosts = [];
//                otherProviderCosts = _this.activeJobDetail.provider.costs;
//                for (var i = 0, y = 0; i < otherProviderCosts.length; i++) {
//                    if (otherProviderCosts[i].type === 'BASE') {
//                        _this.serviceProviderCost = {type: 'BASE', price: otherProviderCosts[i].price};
//                        otherProviderCosts.splice(i, 1);
//                    } else {
//                        _this.otherProviderPayments[y] = {type: otherProviderCosts[i].type, price: otherProviderCosts[i].price, uiName: jobDetailFactory.providerCostTypes(otherProviderCosts[i].type)};
//                        y++;
//                    }
//                }
//                if (_this.activeJobDetail.provider && _this.activeJobDetail.provider.costs) {
//                    _this.activeJobDetail.provider.costs = otherProviderCosts;
//                    _this.otherProviderCostCopy = angular.copy(otherProviderCosts);
//                    _this.initialOtherProviderCostCopy = angular.copy(otherProviderCosts);
//                }
//
//            }

            loggingFactory.log(_this.activeJobDetail);

            _this.cancelReason = config.CANCELREASONS;
            if (partnerConfig.client === 'AUS') {
                _this.paymentType = [{type: 'Credit Card', id: config.CREDITCARDPAYMENT, category: 'worldpay'}];
            } else if (partnerConfig.client === 'UK') {
                _this.paymentType = [{type: 'Credit Card', id: config.CREDITCARDPAYMENT, category: 'paypal'}, {type: 'Third Party Payment', id: config.PARTNERPAYMENT, category: 'thirdparty'}];
            } else {
                _this.paymentType = [{type: 'Credit Card', id: config.CREDITCARDPAYMENT, category: 'paypal'}, {type: 'Third Party Payment', id: config.PARTNERPAYMENT, category: 'thirdparty'}, {type: 'Apple Pay', id: config.APPLEPAY, category: 'applepay'}];
            }
            getPaymentInfo();
            _this.yearArray = utilityFactory.yearRange();
            _this.selYear = _this.yearArray[0];
            _this.monthArray = utilityFactory.getMonth();
            _this.selMonth = _this.monthArray[0];
            _this.mapObj = new MapServices();
            _this.validCreditCard = false;
            _this.isTooltipOpen = false;
            // To show alert action and check is alert acknowledge or not
            alertInfo();
            // Tracking Status
            if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.number) {
                utilityFactory.isPermittedFeature('trackingStatus') && featureFactory.isFeatureAllowed('TRACKINGSTATUS') ? getTrackingStatus(_this.activeJobDetail.service.number) : false;
            }
            //getTrackingStatus(_this.activeJobDetail.service.number);
            initData();
            if (_this.activeJobDetail && _this.activeJobDetail.provider) {
                if (_this.activeJobDetail.service.status === 3) {
                    if (_this.activeJobDetail.provider.status === 1101) {
                        _this.selectedDriverStatus = 'Driver On the way';
                        if(userData.authority !== 'ROLE_DISPATCH'){
                                utilityFactory.isPermittedFeature('cancelWithCharge') ? isCancelJobAllowed(_this.activeJobDetail.service.number) : false;
                            }
                    } else if (_this.activeJobDetail.provider.status === 1102) {
                        _this.selectedDriverStatus = 'Driver On site';
                        //  utilityFactory.isPermittedFeature('cancelWithCharge') ? isCancelJobAllowed(_this.activeJobDetail.service.number):false;
                    }
                }
            }
            if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.price) {
                _this.customerPrice = _this.activeJobDetail.service.price.toFixed(2);
            }
//            if (_this.serviceProviderCost && _this.serviceProviderCost.price) {
//                _this.providerCost = (_this.serviceProviderCost.price !== null) ? _this.serviceProviderCost.price.toFixed(2) : '';
//            }
            if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.created) {
                _this.jobCreatedDate = new Date(_this.activeJobDetail.service.created);
            }
            _this.updatedETA = "";

            if (userData.authority !== 'ROLE_DISPATCH') {
                if($rootScope.internationData.countryIsoCode === 'AU'){
                   getRefundStatus(_this.activeJobDetail.service.number);
                }
            }
            _this.countryPhoneCode = $rootScope.internationData.countryPhoneCode;
            if ($rootScope.selectedTab === 'escalationTab') {
                _this.escalatedTabSelected = true;
                if(_this.activeJobDetail && _this.activeJobDetail.service) {
        getUnvalidateRulesOfJob(_this.activeJobDetail.service.number);
        getValidatedRulesOfJob(_this.activeJobDetail.service.number);
        getValidationHistory(_this.activeJobDetail.service.number);
        setManualValidationRuleMapping();
      }
    }

          initLoadDispatchAlerts();
          if(config.client === 'US'){
            loadProviderPayments();
          }

        }
        init();

        //Plot driver mark on map
        function plotProviderMarker() {
            var providerLat, providerLng;
            if (_this.activeJobDetail.provider) {
                if (_this.activeJobDetail.provider.status == '1101' && _this.activeJobDetail.provider.latitude && _this.activeJobDetail.provider.longitude) {
                    if (_this.updatedETA) {
                        $interval.cancel(_this.updatedETA);
                    }

                    if (!Object.keys(_this.mapObj.driverMarker).length) {
                        providerLat = _this.activeJobDetail.provider.latitude.toString();
                        providerLng = _this.activeJobDetail.provider.longitude.toString();
                        //_this.mapObj.cordinates.push([providerLat,providerLng,(new Date()).getTime()]);
                        _this.mapObj.createMarker({latitude: providerLat, longitude: providerLng, isDriver: true}, true);
                        markerList.push(_this.mapObj.driverMarker);
                    }

                    _this.mapObj.calculateETA(_this.mapObj.driverMarker.position.lat(), _this.mapObj.driverMarker.position.lng(), _this.mapObj.marker.position.lat(), _this.mapObj.marker.position.lng()).then(function (response) {
                        var distance;
                        _this.activeJobDetail.eta = response.duration.text;
                        distance = response.distance.text.split(' ');
                        if (distance[1] === "mi") {
                            distance = distance[0] + ' miles';
                        } else if (distance[1] === "ft") {
                            distance = distance[0] + ' feet';
                        } else if (distance[1] === "km") {
                            distance = distance[0] + ' km';
                        } else if (distance[1] === "m") {
                            distance = distance[0] + ' m';
                        } else if (distance[1] === "ft") {
                            distance = distance[0] + ' ft';
                        }
                        _this.activeJobDetail.distance = distance;
                    }, function (response) {
                        loggingFactory.log('error ETA -->', response);
                    });
                } else if (_this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider.status !== '1102') {
                    if (_this.activeJobDetail.provider.eta.duration && _this.activeJobDetail.provider.eta.receivedAt) {
                        _this.activeJobDetail.provider.distance = null;
                        _this.activeJobDetail.eta = _this.activeJobDetail.provider.eta.duration;
                        _this.activeJobDetail.updatedAt = getTimeFromTimeStamp(_this.activeJobDetail.provider.eta.updateAt);
                        calculateDifferenceTimestamp();
                        calculateManualETA();
                    }
                }
            }
        }
        //get potential reason name
        function  getPotentialReasonName(reasons) {
            var potentialReasonIndex;
            potentialReasonIndex = _.findIndex(_this.potentialReasons, function (s) {
                return s.code == reasons;
            });
            if (potentialReasonIndex >= 0) {
                _this.statusText = _this.potentialStatusText + ' - ' + _this.potentialReasons[potentialReasonIndex].name;
            }

        }
        // Init Data
        function initData() {
            _this.paymentOptions = config.PAYMENTOPTIONS;
            _this.paymentTypeSelected = _this.paymentOptions[0].id;
        }

        //Get Alert Info
        function alertInfo() {
            if (_this.isAlertDetail && _this.data) {
                _this.alertAction = _this.data.alert.alertAction;
                //Check Alert is acknowledged or not
                if (_this.data.alert.ackedAt || _this.data.alert.state === 'Started') {
                    _this.alertButton = 'Complete'
                } else {
                    _this.alertButton = 'Start'
                }
            } else if (_this.isAlertDetail) {
                _this.alertAction = _this.snoozedData.alert.alertAction;
                //Check Alert is acknowledged or not
                if (_this.snoozedData.alert.state === 'Snoozed') {
                    _this.isHide = true;
                }
            }
        }


        // Get Payment Information for Job
        function getPaymentInfo() {
            if (getPaymentInstrument && getPaymentInstrument.data.length) {
                _this.paymentInstrument = getPaymentInstrument.data[0];
                _this.paymentInstrumentType = _this.paymentInstrument.type;
                if (_this.paymentInstrumentType === config.CREDITCARDPAYMENT) {
                    _this.customerPaymentType = _this.paymentType.filter(function (payment) {
                        if (payment.id === _this.paymentInstrumentType) {
                            return payment;
                        }
                    })[0];
                    _this.customerPaymentTypeSelected = _this.customerPaymentType;
                    notification.showLoading();
                    jobDetailFactory.getCreditCardInfo(_this.paymentInstrument.paymentInstrumentId, _this.paymentInstrument.jobNumber).then(function (response) {
                        _this.creditCardInfo = response.data[0];
                        _this.selMonth = _this.creditCardInfo.month;
                        _this.selYear = _this.creditCardInfo.year;
                        if (_this.activeJobDetail && _this.activeJobDetail.service) {
                            _this.updatedPrice = _this.activeJobDetail.service.price;
                        }
                        notification.hideLoading();
                    }, function (response) {
                        notification.hideLoading();
                    });
                } else if (_this.paymentInstrumentType === config.PARTNERPAYMENT) {
                    _this.customerPaymentType = _this.paymentType.filter(function (payment) {
                        if (payment.id === _this.paymentInstrumentType) {
                            return payment;
                        }
                    })[0];
                    _this.customerPaymentTypeSelected = _this.customerPaymentType;
                    _this.isThirdPartyPayment = true;
                    _this.internalRecordId = getPaymentInstrument.data[0].id;
                    notification.showLoading();
                    jobDetailFactory.getThirdPartyToken(_this.paymentInstrument.paymentInstrumentId, _this.paymentInstrument.jobNumber).then(
                            function (response) {
                                notification.hideLoading();
                                _this.partnerPaymentToken = response.data[0].token;
                                _this.internalRecordId = response.data[0].token;
                            }, function (response) {
                        notification.hideLoading();
                    }
                    );
                } else if (_this.paymentInstrumentType === config.APPLEPAY) {
                    _this.customerPaymentType = _this.paymentType.filter(function (payment) {
                        if (payment.id === _this.paymentInstrumentType) {
                            return payment;
                        }
                    })[0];
                    _this.customerPaymentTypeSelected = _this.customerPaymentType;
                    _this.internalRecordId = getPaymentInstrument.data[0].id;
                }
            }
        }

        function onModalRender() {
            if (document.getElementById('jobDetailMap') && !document.getElementById('jobDetailMap').childNodes.length) {
                var providerLat, providerLng;
                loggingFactory.log('pubnubChannel:', userData.channel);
                angular.element('.modal-dialog').addClass('mainModalPadding width880');
                //loggingFactory.log(_this.mapObj.adjustingAnimation);
                if (_this.mapObj.adjustingAnimation == false) {
                    _this.mapObj.showMap(document.getElementById('jobDetailMap'), undefined, true);
                  if(_this.activeJobDetail && _this.activeJobDetail.location) {
                    _this.mapObj.createMarker({latitude: _this.activeJobDetail.location.latitude || '23', longitude: _this.activeJobDetail.location.longitude || '72', jobDetail: _this.activeJobDetail}, true);
                    markerList.push(_this.mapObj.marker);
                    if (_this.activeJobDetail && _this.activeJobDetail.provider && (_this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider.status === 1101) || (_this.activeJobDetail.service.status === 3 && (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status !== 1102))) {
                        plotProviderMarker();
                    }
                    _this.mapObj.fitMarkerOnMap(markerList);
                }
			}

                angular.element('#jobDetailMap').append($compile('<div class="markerDots z-index-1">' +
                        '<div class=""><div class="driverDot"></div><span>Driver</span></div>' +
                        '<div class=""><div class="customerDot"></div><span>Customer</span></div>' +
                        '</div>')($scope));

                angular.element('#jobDetailMap').append($compile('<div class="getLocIcon z-index-1" ng-click="jobDetail.setMapToLocation(jobDetail.activeJobDetail.location)">' +
                        '</div>')($scope));

                angular.element('#jobDetailMap').append($compile('<div ng-if="(jobDetail.activeJobDetail.eta &&  jobDetail.activeJobDetail.provider && jobDetail.activeJobDetail.service.status === 3 && jobDetail.activeJobDetail.provider.status !== 1102) || (jobDetail.activeJobDetail.eta && jobDetail.activeJobDetail.provider && jobDetail.activeJobDetail.service.status === 3 && jobDetail.activeJobDetail.provider.status === 1101)"   class="mapSubtitle">ETA: <span ng-bind="jobDetail.activeJobDetail.eta"></span>  <span ng-if="jobDetail.activeJobDetail.distance">| Distance: <span ng-bind="jobDetail.activeJobDetail.distance"></span></span><span ng-if="jobDetail.activeJobDetail.updatedAt  && jobDetail.activeJobDetail.provider.status !== 1102 && jobDetail.activeJobDetail.provider.status !== 1101  && jobDetail.activeJobDetail.service.status === 3 && config.client==\'US\'">| Updated at: <span ng-bind="jobDetail.activeJobDetail.updatedAt "></span></span></div>')($scope));
                //if(_this.isChatOpen){
                //  angular.element('.modalJobDetail')[0].scrollTop = '445';
                //}
            } else {
                $interval.cancel(window.loadJobDetailMap);
            }
        }

        //load google map after the popup is rendered and create marker and animation

        $uibModalInstance.rendered.then(function () {

            if (document.getElementById('jobDetailMap') && !document.getElementById('jobDetailMap').childNodes.length) {
                onModalRender();

                if (_this.activeJobDetail && _this.activeJobDetail.provider && (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider.status === 1101) || (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.status === 3 && (_this.activeJobDetail && _this.activeJobDetail.provider && _this.activeJobDetail.provider.status !== 1102))) {
                    _this.beginProviderAnimation();
                }
            }

        });

        window.loadJobDetailMap = $interval(onModalRender, 1000);

        function calculateDifferenceTimestamp() {
            var newDuration = null;
            var currentTimeStamp = new Date().getTime();
            var estimatedTimeStamp = _this.activeJobDetail.provider.eta.receivedAt + _this.activeJobDetail.provider.eta.duration * 60 * 1000;
            newDuration = Math.ceil((estimatedTimeStamp - currentTimeStamp) / 60000);

            if (newDuration <= 0) {
                newDuration = null;
                $interval.cancel(_this.updatedETA);
            }
            if (partnerConfig.client === 'AUS') {
                _this.activeJobDetail.eta = (newDuration != null) ? newDuration + " mins" : newDuration;
            } else {
                newDuration = _this.activeJobDetail.eta;
                _this.activeJobDetail.eta = newDuration + ' mins';
            }

        }

        //manual ETA
        function calculateManualETA() {
            if (partnerConfig.client === 'AUS') {
                _this.updatedETA = $interval(calculateDifferenceTimestamp, 60000);
            }
        }

        //check if payment is card or third party
        function validatePayment(jobNumber) {
            if (_this.selPaymentType === 'Credit Card') {
                creditCardAuthorization(jobNumber);
            } else if (_this.selPaymentType === 'Third Party Payment') {
                validateThirdPartyPayment(jobNumber);
            }
        }

        //credit card
        function creditCardAuthorization(jobNumber) {
            var data = {
                'amount': _this.activeJobDetail.service.price,
                'cardType': _this.cardType,
                'number': _this.ccNumber,
                'year': _this.expYear,
                'month': _this.expMonth
            };
            notification.showLoading();
            jobDetailFactory.creditCardAuthorization(jobNumber, _this.activeJobDetail.service.price, data).then(function (response) {
                notification.hideLoading();
                loggingFactory.log('-- Credit Card Authorization ---', response);
                notification.showSuccess(appString.CCPAYMENTSUCCESS);
            }, function (response) {
                notification.hideLoading();
                exceptionFactory.catchException('Error in VALIDATING CREDIT CARD -->' + response);
                notification.showSuccess(appString.CCPAYMENTERROR);
            });
        }


        //third party payment
        function validateThirdPartyPayment(jobNumber) {
            notification.showLoading();
            jobDetailFactory.validateThirdPartyPayment(jobNumber, _this.activeJobDetail.service.price, _this.paymentToken).then(function (response) {
                loggingFactory.log('-- Payment Validated ---', response);
                notification.showSuccess(appString.THIRDPARTYPAYMENTSUCCESS);
                notification.hideLoading();
            }, function (response) {
                notification.showSuccess(appString.THIRDPARTYPAYMENTERROR);
                exceptionFactory.catchException('Error in VALIDATION THIRD PARTY  -->' + response);
                notification.hideLoading();
            });
        }


        // Cancel Pop up
        function cancel() {
            $uibModalStack.dismissAll();
            $uibModalInstance.dismiss('cancel');
            clearInterval(_this.mapObj.mapClearInterval);
            _this.mapObj.resetMapConfig();
        }

        //On cancel reason selected

        function onCancelSelected(reasonId, jobNumber) {
            notification.showLoading();
            jobDetailFactory.cancelJob(reasonId, jobNumber).then(function (response) {
                _this.isTooltipOpen = false;
                _this.isCancelJob = true;
                notification.hideLoading();
            }, function (response) {
                exceptionFactory.catchException('Error in CANCEL JOB -->' + response);
                notification.hideLoading();
            });
        }

        // Cancel Job
        function cancelJob(reasonId, jobNumber) {

            if (reasonId === '10') {
                modalInstanceReasonNote = $uibModal.open({
                    scope: $scope,
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'scripts/modules/home/content/csr/jobdetail/otherCancelReason.template.html',
                    windowTopClass: 'modalEditTeamMember InputCretCardPopup'
                });
            } else {
                onCancelSelected(reasonId, jobNumber);
            }
        }
        // Validate Credit card
        function validateCreditCard(event) {
            var cardData = utilityFactory.validateCreditCard(_this.ccNumber);
            _this.cardType = cardData.cardType;
            _this.validCreditCard = cardData.validCreditCard;
        }

        function beginProviderAnimation() {
            if (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status === 1101) {
                //_this.mapObj.cordinates.push([response.provider.latitude,response.provider.longitude,(new Date()).getTime()]);
                var fromLat = _this.activeJobDetail.provider.latitude;
                var fromLng = _this.activeJobDetail.provider.latitude;
                var toLat = _this.activeJobDetail.location.latitude;
                var toLng = _this.activeJobDetail.location.latitude;
                if (fromLat && fromLng && toLat && toLng) {
                    if (!_this.mapObj.animationStarted) {
                        _this.mapObj.startProviderAnimation(fromLat, fromLng, toLat, toLng);
                    }
                    //_this.mapObj.startAnimation(true);
                }
            }
        }

        //handler on pubnub for provider
        function onProviderLocationUpdate(event, data) {
            var response = data;
            loggingFactory.log(response);
            if (response.service.number === _this.activeJobDetail.service.number) {
                if (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status === 1101) {
                    //loggingFactory.log("Pubnub came: "+_this.mapObj.cordinates.length);
                    if (_this.mapObj.cordinates.length > 11) {
                        _this.mapObj.cordinates = [];
                        _this.mapObj.cordinates.push([response.provider.latitude, response.provider.longitude, (new Date()).getTime()]);
                        _this.mapObj.adjustAnimation();
                    } else {
                        _this.mapObj.cordinates.push([response.provider.latitude, response.provider.longitude, (new Date()).getTime()]);
                    }
                    if (_this.mapObj.isUpdating) {
                        //_this.mapObj.startAnimation(true);
                    }
                }
            }
        }

        /*
         function destroyAnimationVars(){
         $interval.cancel(_this.mapObj.timer_id);
         _this.mapObj.start = 0;
         _this.mapObj.count = 0;
         _this.mapObj.shortestRouteIndex = 0;
         _this.mapObj.driverMarker = null;
         _this.mapObj.marker = null;
         _this.mapObj.googleRoute = null;
         _this.mapObj.length = null;
         _this.mapObj.polyline = null;
         _this.mapObj.timer_id = null;
         } */

        // Edit Payment information
        function editPayment() {
            event.stopPropagation();
            _this.editPaymentFlag = true;
        }

        // Void a transaction
        function voidTransaction() {
            _this.isPaymentOpen = false;
            notification.showLoading();
            jobDetailFactory.voidTransaction(getPaymentInstrument.data[0].paymentInstrumentId, getPaymentInstrument.data[0].jobNumber).then(function (response) {
                notification.hideLoading();
                if (response.data[0] === "Success") {
                    jobDetailFactory.getPaymentInstrument(_this.activeJobDetail).then(function (response) {
                        getPaymentInstrument = response;
                        _this.paymentInstrument = getPaymentInstrument ? getPaymentInstrument.data[0] : '';
                        getPaymentInfo();
                    }, function () {

                    });
                }
            }, function (response) {
            });
            //  notification.hideLoading();
        }


        //authourize credit card and display info
        function authorizeCreditCard(price, cardData, cardType, ccNumber, selCardYear, selCardMonth) {
            if (price !== null && price !== undefined && price !== '' && cardData.validCreditCard) {
                var data = {'amount': price, 'cardType': cardType, 'number': ccNumber, 'year': selCardYear, 'month': selCardMonth};
                jobDetailFactory.creditCardAuthorization(_this.activeJobDetail.service.number, userData.partnerId, _this.activeJobDetail.personalInfo.name, data).then(function (response) {
                    getPaymentInstrument = response;
                    _this.paymentInstrument = response.data[0];
                    jobDetailFactory.getCreditCardInfo(response.data[0].paymentInstrumentId, response.data[0].jobNumber).then(function (response) {
                        _this.isEditPaymentError = false;
                        _this.creditCardInfo = response.data[0];
                        _this.selMonth = _this.creditCardInfo.month;
                        _this.selYear = _this.creditCardInfo.year;
                        _this.updatedPrice = _this.activeJobDetail.service.price;
                        _this.customerPaymentTypeCopy = _this.customerPaymentType;
                        notification.hideLoading();
                        _this.editPaymentFlag = false;
                        cancelChangeStatusPopUp();
                    }, function (response) {
                        _this.isEditPaymentError = true;
                        notification.hideLoading();
                        return false;
                    });
                }, function (response) {
//          loggingFactory.log(response);
                    _this.isEditPaymentError = true;
                    notification.hideLoading();
                    return false;
                });

            }
        }

        //authorize third party payement and display info
        function authorizeThirdPartyPayment(price, token) {
            addJobFactory.partnerPayment(_this.activeJobDetail.service.number, price, token).then(function (response) {
                getPaymentInstrument = response;
                _this.paymentInstrument = response.data[0];
                _this.isEditPaymentError = false;
                notification.hideLoading();
                _this.customerPaymentTypeCopy = _this.customerPaymentType;
                cancelChangeStatusPopUp();
            }, function () {
                notification.hideLoading();
                _this.isEditPaymentError = true;
                return false;
            })
        }


        // Save the updated payment
        function savePayment(price, token, cardType, ccNumber, selCardYear, selCardMonth) {

            /* if(config.client==='AUS') {
             if(price > 500) {
             _this.isAmountError = true;
             return false;
             }
             }*/
            jobDetailFactory.updateJobPrice(_this.activeJobDetail.service.number, price).then(function (response) {
                _this.worldPayPrice = price;
                //_this.activeJobDetail.service.price = price
                if (config.client === 'AUS') {
                    if (modalInstanceCustomerPrice) {
                        modalInstanceCustomerPrice.dismiss('cancel');
                    }
                    _this.openWorldPayPaymentModal();
                } else {
                    _this.customerPaymentTypeSelected = (_this.customerPaymentType) ? _this.customerPaymentType : _this.customerPaymentTypeCopy;
                    if (_this.customerPaymentType) {
                        if (_this.paymentInstrumentType === config.CREDITCARDPAYMENT) {
                            if (_this.customerPaymentType && _this.customerPaymentType.category === 'paypal') {
                                var cardData = utilityFactory.validateCreditCard(ccNumber);
                                if (cardData.validCreditCard) {
                                    _this.isInValidCreditCard = false;
                                    notification.showLoading();
                                    if (_this.paymentInstrument) {
                                        jobDetailFactory.voidSavedCreditCard(_this.paymentInstrument.paymentInstrumentId, _this.activeJobDetail.service.number).then(function () {
                                            authorizeCreditCard(price, cardData, cardType, ccNumber, selCardYear, selCardMonth);
                                        }, function () {
                                            _this.isEditPaymentError = true;
                                            notification.hideLoading();
                                            return false;
                                        });
                                    } else {
                                        authorizeCreditCard(price, cardData, cardType, ccNumber, selCardYear, selCardMonth);
                                    }

                                } else {
                                    _this.isInValidCreditCard = true;
                                    return false;
                                }
                            } else if (_this.customerPaymentType && _this.customerPaymentType.category === 'worldpay') {

                            }

                        } else if (_this.paymentInstrumentType === config.PARTNERPAYMENT) {
                            if (token) {
                                if (_this.paymentInstrument) {
                                    notification.showLoading();
                                    jobDetailFactory.voidThirdPartyPayment(_this.paymentInstrument.paymentInstrumentId, _this.activeJobDetail.service.number).then(function (response) {
                                        authorizeThirdPartyPayment(price, token)
                                    }, function (response) {
                                        notification.hideLoading();
                                        _this.isEditPaymentError = true;
                                        return false;
                                    });
                                } else {
                                    authorizeThirdPartyPayment(price, token)
                                }
                            } else {
                                _this.isEditPaymentError = true;
                                return false;
                            }
                        }
                    }
                }


                _this.activeJobDetail.service.price = parseInt(price);

                if (modalInstanceCustomerPayment && !_this.customerPaymentType) {
                    modalInstanceCustomerPayment.dismiss('cancel');
                    getPaymentInfo();
                }
            }, function () {
                notification.hideLoading();
            })
            //event.stopPropagation();
//      if(_this.activeJobDetail.service.price !== price)
//      {

            // }
        }


        function openChangeVehicleLoc() {
            modalInstanceChangeVehicleLoc = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/changeVehicleLoc.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp'
            });
        }

        function openChangeDropOffLoc() {
            modalInstanceChangeVehicleLoc = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/changeDropOffLoc.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp'
            });
        }

        function openJobEventLogModal() {
            if (!modalInstanceEvetModal) {
                modalInstanceEvetModal = $uibModal.open({
                    scope: $scope,
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'scripts/modules/home/content/csr/jobdetail/jobEventLog.template.html',
                    windowClass: 'fade modal-large-transp modal-offset-top alertsChat'
                });

                modalInstanceEvetModal.result.catch(function () {
                    //Do stuff with respect to dismissal
                    modalInstanceEvetModal = null;
                });
            }
        }

        function openEmailReceipt() {
            modalInstanceEmailReceiptModal = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/emailReceipt.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp'
            });
        }

        function openChangeStatus() {
            _this.statusSelected = null;
            getPotentials();
            modalInstanceChangeStatusModal = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/changeJobStatus.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup'
            });
        }

        function openCancelReasons() {
            getCancelReasons()
            modalInstanceCancelReasonModal = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/cancelByCustomer.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp'
            });
        }

        // Cancel Job Pop up
        function openCancelPopup() {
            _this.selectedCancelReason = null;
            _this.otherCancelReasonNote = null;
            if (_this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider) {

                if (_this.activeJobDetail.provider.status === 1101) {
                   if(userData.authority !== 'ROLE_DISPATCH'){
                                utilityFactory.isPermittedFeature('cancelWithCharge') ? isCancelJobAllowed(_this.activeJobDetail.service.number) : false;
                            }
                }
            }
            modalInstanceCancelJob = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/cancelReason.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp'
            });
        }
        // Close the cancel pop up
        function closeCancelJobPopup() {
            modalInstanceCancelJob.dismiss('cancel');
        }

        // Cancel Job
        function cancelJob(reasonId, jobNumber, reasonNote) {
            if (reasonId) {
                onCancelSelected(reasonId, jobNumber, reasonNote);
            }
        }
        //On cancel reason selected
        function onCancelSelected(reasonId, jobNumber, reasonNote) {
            if (reasonId) {
                notification.showLoading();
                if (_this.cancellationCharge) {
                    jobDetailFactory.cancelJobWithCharge(jobNumber).then(function (response) {
                        notification.hideLoading();
                        modalInstanceCancelJob.dismiss('cancel');
                    }, function () {
                        notification.hideLoading();
                    })
                } else {
                    jobDetailFactory.cancelJob(reasonId, jobNumber, reasonNote).then(function (response) {
                        _this.isTooltipOpen = false;
                        _this.isCancelJob = true;
                        modalInstanceCancelJob.dismiss('cancel');
                        notification.hideLoading();
                    }, function (response) {
                        exceptionFactory.catchException('Error in CANCEL JOB -->' + response);
                        notification.hideLoading();
                    })
                }
                ;
            }
        }
        // cancel Reason change
        function cancelReasonChange(cancelReason) {
            _this.selectedCancelReason = cancelReason;
        }

        function openCustomSnoozeModal(id, type) {
            $scope.$emit('openCustomSnoozePopup', {alertId: id, openFrom: type, jobDetailInstance: $uibModalInstance});
        }
        // Open Message/Notes/Chat Modal
        function openMsgNotesChatModal() {
            if (!modalInstanceMessageNotesChat) {
                modalInstanceMessageNotesChat = $uibModal.open({
                    scope: $scope,
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'scripts/modules/home/content/csr/jobdetail/messageModal.template.html',
                    windowClass: 'fade modal-large modal-dialog modal-lg modal-offset-top alertsChat messagePopup'
                });
            }
        }
        // Open update timing modal
        function openUpdateTiming() {
            modalInstanceUpateTiming = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/updateTiming.template.html',
                windowClass: 'fade modalEditTeamMember InputCretCardPopup CancelJobPopup mainModalPadding alertUpdateTimingPopUp'
            });
        }
        //Open confirmation Modal
        function openConfirmationModal() {
            modalInstanceConfirmAction = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/acknowledgeConfirmation.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp CancelJobPopup'
            });
        }
        // Open Customer Payment Edit Modal
        function openCustomerPaymentModal() {
            _this.isEditPaymentError = false;
            _this.customerPaymentTypeCopy = _this.customerPaymentType;
            _this.customerPaymentType = null;
            modalInstanceCustomerPayment = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/customerPayment.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp CancelJobPopup'
            });
        }

        // Open Customer Price Modal
        function openCustomerPriceModal() {
            _this.isAmountError = false;
            _this.isEditPaymentError = false;
            _this.customerPaymentTypeCopy = _this.customerPaymentType;
            modalInstanceCustomerPrice = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/customerPrice.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp CancelJobPopup'
            });
        }

        // Open Customer Payment Edit Modal
        function openWorldPayPaymentModal() {
            _this.isEditPaymentError = false;
            _this.customerPaymentTypeCopy = _this.customerPaymentType;
            modalInstanceWorldPayment = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/worldPay.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp CancelJobPopup'
            });
            setSelectedPaymentType(_this.paymentType[0]);
        }

        // open Provider payment edit modal
        function openOtherProviderPaymentModal() {
            _this.isOtherPaymentProviderUpdateError = false;

            _this.amount = "";
            _this.selectedOtherProviderCost = "";
            _this.isInValidProviderCostType = false;
            _this.isInValidAmount = false;
            _this.otherProviderCostCopy = angular.copy(_this.initialOtherProviderCostCopy);
            for (var i = 0; i < _this.otherProviderCostCopy.length; i++) {
                _this.otherProviderCostCopy[i].price = _this.otherProviderCostCopy[i].price.toFixed(2);
            }
            _this.isSaving = false;

            notification.showLoading();
            jobDetailFactory.getProviderPaymentTypes().then(function (response) {
//        _this.otherProviderCost = response;
                for (var i = 0, y = 0; i < response.length; i++) {
                    if (response[i] !== 'BASE') {
                        _this.otherProviderCost[y] = {uiName: jobDetailFactory.providerCostTypes(response[i]), bEndName: response[i]};
                        y++;
                    }
                }

                modalInstanceOtherProviderPayment = $uibModal.open({
                    scope: $scope,
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'scripts/modules/home/content/csr/jobdetail/otherProviderPayment.template.html',
                    windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp CancelJobPopup EditpaymentDetailPopup04042016'
                });
                notification.hideLoading();
            }, function () {
                // notification.hideLoading();
            });
        }

        function openProviderPaymentModal() {
            modalInstanceProviderPayment = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/providerPayment.template.html',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp CancelJobPopup EditpaymentDetailPopup04042016'
            });
        }
//    function cancelPaymentModal(){
//      modalInstancePaymentModal.dismiss('cancel');
//    }
        function cancelVehicleLocPopup() {
            _this.isSaveVehicleLoc = false;
            _this.newVehicleLoc = null;
            modalInstanceChangeVehicleLoc.dismiss('cancel');
        }

        //Close Message/Notes/Chat Modal
        function cancelMsgNotesChatModal() {
            modalInstanceMessageNotesChat.dismiss('cancel');
            modalInstanceMessageNotesChat = null;
            _this.chatSummary = [];
            _this.isChatOpen = false;
        }

        // Close update timing pop up
        function cancelUpdateTimingModal() {
            modalInstanceUpateTiming.dismiss('cancel');
        }
//    function cancelNotes(){
//      modalInstanceNotes.dismiss('cancel');
//    }

//    function cancelSendTextToCustomerPopup(){
//      modalInstanceTextToCustomer.dismiss('cancel');
//    }

//    function cancelSendTextToDriversPopup(){
//      modalInstanceTextToDriver.dismiss('cancel');
//    }

//    function cancelProviderPopUp(){
//      modalInstanceProvider.dismiss('cancel');
//    }

        function cancelJobEventLog() {
            modalInstanceEvetModal.dismiss('cancel');
            modalInstanceEvetModal = null;
        }

        function cancelEmailReceipt() {
            modalInstanceEmailReceiptModal.dismiss('cancel');
        }
        function cancelJobChangeStatusPopUp() {
            modalInstanceChangeStatusModal.dismiss('cancel');
        }
        // Cancel Cancel Job Pop Up
        function cancelReasonPopUp() {
            modalInstanceCancelReasonModal.dismiss('cancel');
        }

        // Cancel confrirmation modal
        function cancelConfirmationModal() {
            modalInstanceConfirmAction.dismiss('cancel');
        }
        //Cancel customer payment modal
        function cancelChangeStatusPopUp() {
            if (modalInstanceCustomerPayment) {
                if (_this.customerPaymentType && _this.customerPaymentType.category === 'worldpay') {
                    _this.customerPaymentType = _this.customerPaymentTypeCopy;
                    cancelWorldPayPopUp();
                    return;
                }
                modalInstanceCustomerPayment.dismiss('cancel');
                _this.ccNumber = _this.internalRecordId = _this.cardType = null;
                _this.selYear = _this.yearArray[0];
                _this.selMonth = _this.monthArray[0];
                _this.customerPaymentType = _this.customerPaymentTypeCopy;
            }
        }
        //Cancel provider payment pop up
        function cancelOtherProviderPaymentPopUp() {
            modalInstanceOtherProviderPayment.dismiss('cancel');
        }
        // Cancel provider payment pop up
        function cancelProviderPaymentPopUp() {
            modalInstanceProviderPayment.dismiss('cancel');
        }
        function saveVehicleLocPopup(newVehicleLocation, jobNumber, isFromSMSlink) {
            _this.isSaveVehicleLoc = true;
            jobDetailFactory.changeVehicleLoc(newVehicleLocation.formatted_address || newVehicleLocation, jobNumber, 1).then(function (response) {// jshint ignore:line
                if (!isFromSMSlink) {
                    _this.newVehicleLoc = null;
                    modalInstanceChangeVehicleLoc.dismiss('cancel');
                }
            }, function (response) {
                //loggingFactory.log(response);
            });
        }

        function saveDropOffLocPopup(newVehicleLocation, jobNumber) {
            _this.isSaveVehicleLoc = true;
            jobDetailFactory.changeVehicleLoc(newVehicleLocation.formatted_address || newVehicleLocation, jobNumber, 2).then(function (response) {// jshint ignore:line
                _this.newVehicleLoc = null;
                modalInstanceChangeVehicleLoc.dismiss('cancel');
            }, function (response) {
                //loggingFactory.log(response);
            });
        }

        // Send Notes to CSR
        function sendNotes(text, jobNumber) {
            _this.notes = text;
            jobDetailFactory.postNotes(text, jobNumber, userData.id).then(function (response) {// jshint ignore:line
                _this.notes = null;
                jobDetailFactory.getNotesList(jobNumber).then(function (response) {
                    _this.notesList = response.data;
//          $timeout(function (){
//               angular.element(document.getElementById('notesDiv')).scrollTop('99999999999999');
//           },100);
                })
                //modalInstanceNotes.dismiss('cancel');
            }, function (response) {
            });
        }
        // Send Message to customer
        function sendTextToCustomer(text, jobNumber) {
            if (_this.sendCannedMsg) {
                putCannedMessages(jobNumber, _this.selectedCannedMsg.id, text)
                if (_this.selectedCannedMsg.id === 2) {
                    var phone = _this.activeJobDetail.personalInfo.phone;
                    _this.getLocation(phone);
                    $timeout(_this.unsubscribeGetLocationChannel, 300000);
                }
            } else
            {
                jobDetailFactory.postTextToCustomer(text, jobNumber, userData.id).then(function (response) {// jshint ignore:line
                    _this.textMsg = null;
                    jobDetailFactory.getCustomerMessages(jobNumber).then(function (response) {
                        _this.msgList = response.data;
                        // $timeout(function (){
                        //    angular.element(document.getElementById('msgDiv')).scrollTop('99999999999999');
                        // },100);
                    }, function (response) {
                    });
                })
            }
            _this.sendCannedMsg = false;
        }
        function calculateScrollHeight(elem) {
            var height = elem.height();
            var scroll = elem.prop('scrollHeight');
            var scrollTo = (elem.prop('scrollHeight') - elem.height());
            elem.scrollTop('99999999999');
        }
//    function getCheckBox(value){
//     _this.sendJobInfoToDriver = value;
//
//    }
        // Send Message to driver
        function sendTextToDriver(text, jobNumber, includeJob) {
            _this.textToDriver = text;
            if (_this.sendCannedMsg) {
                putCannedMessages(jobNumber, _this.selectedCannedMsg.id, text)
            } else
            {
                jobDetailFactory.postTextToDriver(text, jobNumber, userData.id, includeJob).then(function (response) {// jshint ignore:line
                    _this.textMsg = null;
                    jobDetailFactory.getDriverMessages(jobNumber).then(function (response) {
                        _this.msgList = response.data
                        // $timeout(function (){
                        //      angular.element(document.getElementById('msgDiv')).scrollTop('99999999999999');
                        // },100);
                    })
                }, function (response) {
                });
            }
            _this.sendCannedMsg = false;
        }

        function sendEmailReceipt(jobNumber, email) {
            if (utilityFactory.isValidEmail(email)) {
                _this.isValidEmail = true;
                jobDetailFactory.postEmailReceipt(jobNumber, email).then(function (response) {// jshint ignore:line
                    _this.email = null;
                    modalInstanceEmailReceiptModal.dismiss('cancel');
                }, function (response) {
                });
            } else {
                _this.isValidEmail = false;
            }
        }

        function toggleCancelTooltip() {
            _this.isTooltipOpen = !_this.isTooltipOpen;
        }

        function setAssignCSR(peer) {
            if (peer.id !== _this.assignedCsr.id) {
                jobDetailFactory.assignCsr(_this.activeJobDetail.service.number, _this.assignedCsr.id, peer.id).then(function () {
                    _this.assignedCsr = peer;
                }, function () {

                });
            }

        }

        function setMonth(month) {
            _this.selMonth = month;
        }

        function setYear(year) {
            _this.selYear = year;
        }

        function minimizeJob(job) {
            var isUnique = true;
            $uibModalInstance.dismiss('cancel');
            angular.forEach(minimizeJobs, function (item) {
                if (item.service.number === job.service.number) {
                    isUnique = false;
                }
            });
            if (isUnique) {
                minimizeJobs.push(job);
            }
        }

        //send chat message
        function sendChatMessage(message) {
            if (message.trim()) {
                jobDetailFactory.sendChatMessage(_this.activeJobDetail.service.number, message);
                _this.chatInput = ''
            }
        }

        function onChatMessageRecieved(event, data) {
            var obj;
            var lastMsgPerJob = shareableContent.getLastMsgPerJob();
            var jobNumber = (data.service ? data.service.number : null);
            if (jobNumber === _this.activeJobDetail.service.number) {
                if (_this.isChatOpen) {
                    _this.chatSummary.push(data);
                    if ((lastMsgPerJob.map(function (item) {
                        return Object.keys(item).toString()
                    }).indexOf(data.service.number.toString())) !== -1) {
                        lastMsgPerJob[lastMsgPerJob.map(function (item) {
                            return Object.keys(item).toString()
                        }).indexOf(data.service.number.toString())][data.service.number] = new Date(data.currentTimeStamp).getTime();
                        shareableContent.setLastMsgPerJob(lastMsgPerJob);
                        localStorage.setItem('lastMsgPerJob', JSON.stringify(lastMsgPerJob));
                    } else {
                        obj = {};
                        obj[data.service.number] = new Date(data.currentTimeStamp).getTime();
                        lastMsgPerJob.push(obj);
                        shareableContent.setLastMsgPerJob(lastMsgPerJob);
                        localStorage.setItem('lastMsgPerJob', JSON.stringify(lastMsgPerJob));
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    ;
                    if (angular.element('#chatDiv')[0]) {
                        angular.element('#chatDiv')[0].scrollTop = '9999999';
                    }
                    activeJobListDetail.isChat = false;
                    $scope.$emit('OnChatRead', _this.activeJobDetail.service.number);
                } else {
                    _this.chatSummaryUnread.push(data);
                }

            }
        }

        // Alert Button to (Start/Close) the alert
        function alertBtn(text) {
            if (text === 'Start') {
                acknowledge();
            } else {
                closeAlert();
            }
        }
        // To acknowlege an alert
        function acknowledge() {
            var index = _this.jobList.indexOf(_this.data);
            $scope.$emit('acknowledgeAlert', {userId: userData.id, alertId: _this.data.alert.id});
        }
        // Change start to complete
        function startToComplete(event, data) {
            _this.alertButton = data.text;
        }
        // To close an alert
        function closeAlert() {
            var index = _this.jobList.indexOf(_this.data);
            $scope.$emit('closeAlert', {userId: userData.id, alertId: _this.data.alert.id});
            cancel();
        }

        // To snooze an alert
        function snooze(snooze, event) {
            var index = _this.jobList.indexOf(_this.data);
            if (snooze == 'Completed') {
                closeAlert();
            } else if (snooze == 'Custom') {
                // event.currentTarget.parentElement.remove();
                openCustomSnoozeModal(_this.data.alert.id, "jobDetail");
            } else {
                $scope.$emit('snoozeAlert', {userId: userData.id, alertId: _this.data.alert.id, duration: snooze, jobDetailInstance: $uibModalInstance, elem: event.currentTarget.parentElement});
            }

        }
        // Cancel Custom Snooze Modal
        function cancelCustomSnooze() {
            modalInstanceCustomSnooze.dismiss('cancel');
        }
        function cancelReasonNotePopup() {
            _this.cancelReasonNote = null;
            modalInstanceReasonNote.dismiss('cancel');
        }

        function saveReasonNotePopup(reasonId, jobNumber, reasonNote) {
            _this.cancelReasonNote = null;
            modalInstanceReasonNote.dismiss('cancel');
            onCancelSelected(reasonId, jobNumber);
        }

        function inviteProvider(jobNumber) {
            jobDetailFactory.getProviders(jobNumber, 1).then(function (response) {
                _this.providerAvaliable = response.data;
                _this.provider = response.data;
                _this.providerHeader = 'Invited Provider'
                openProviderModal();
            })
        }

        function checkOutProvider(jobNumber) {
            jobDetailFactory.getProviders(jobNumber, 2).then(function (response) {
                _this.providerCheckOut = response.data;
                _this.provider = response.data;
                _this.providerHeader = 'CheckedOut Provider'
                openProviderModal();
            })
        }
        function getServices() {
            jobDetailFactory.getServices('roadside', userData.partners[0].id).then(function (response) {
                _this.services = response.data;
            })
        }
        function changeService(jobNumber, selectedService) {
            var serviceId;
            for (var i = 0; i < _this.services.length; i++) {
                if (selectedService == _this.services[i].name) {
                    serviceId = _this.services[i].serviceId;
                    break;
                }
            }
            jobDetailFactory.changeServices(jobNumber, serviceId).then(function (response) {

            })
        }
        // Get Job Event Log
        function jobEventsLog(jobNumber, offset, limit) {
            _this.allLog = [];
            notification.showLoading();
            jobDetailFactory.getJobEventLog(jobNumber, offset, limit).then(function (response) {
                notification.hideLoading();
                if (response.data.length > 0) {
                    _this.jobEventLog = response.data;
                    //if(!modalInstanceEvetModal){
                    _this.openJobEventLogModal();
                    //}

                }
                _this.startTS = _this.jobEventLog[0].ts;

            }, function (response) {
                notification.hideLoading();
            })
        }
        // Get Alert Event Log
        function alertEventsLog(jobNumber, offset, limit) {
            _this.allLog = [];
            notification.showLoading();
            jobDetailFactory.getAlertEventsLog(jobNumber, offset, limit).then(function (response) {
                notification.hideLoading();
                if (response.data.length > 0) {
                    _this.alertEventLog = response.data;
                    //if(!modalInstanceEvetModal){
                    _this.openJobEventLogModal();
                    //}
                    // _this.startTS =  _this.alertEventLog[0].ts;
                }


            }, function (response) {
                notification.hideLoading();
            })
        }
        //Covert TimeStamp
        function DMYHMS(ts) {
            var date = utilityFactory.convertmiliSecondsToDMYHMS(ts);
            return date;
        }
        function getElapseTime(startTs, endTs) {
            //var time = utilityFactory.calculateElapsedTime(startTs,endTs);
            var timeObject = utilityFactory.calculateDuration(startTs, endTs);
            return timeObject.time;
        }
        //Get job events log on scroll end
        function onScrollEnd() {
            if (_this.isScrollable == true) {
                _this.eventPageOffset += _this.eventPageLimit;
                jobEventsLog(_this.activeJobDetail.service.number, _this.eventPageOffset, _this.eventPageLimit);
                _this.isScrollable = false;
            }
        }
        //Call getJobEventLog() on scroll end
        function getEventsLog() {
            //  $scope.$emit('eventScrollEnd');
            _this.isScrollable = true;
            onScrollEnd();
        }

        //Get job events log on scroll end
        function onAlertScrollEnd() {
            if (_this.isScrollable == true) {
                _this.alertPageOffset += _this.alertPageLimit;
                alertEventsLog(_this.activeJobDetail.service.number, _this.alertPageOffset, _this.alertPageLimit);
                _this.isScrollable = false;
            }
        }


        function allLogPagesScrollEnd() {
            if (_this.isScrollable == true) {
                _this.allPageOffset += _this.allPageLimit;
                jobLog(_this.activeJobDetail.service.number, _this.allPageOffset, _this.allPageLimit);
                _this.isScrollable = false;
            }
        }


        //Call getAlertEventsLog() on scroll end
        function getAlertLogPages() {
            _this.isScrollable = true;
            onAlertScrollEnd();
        }

        // Call jobLog() on scroll end
        function getAllLogPages() {
            _this.isScrollable = true;
            allLogPagesScrollEnd();
        }


        // Get List of Messages to Customer
        function getCustomerMessages() {
            jobDetailFactory.getCustomerMessages(_this.activeJobDetail.service.number).then(function (response) {
                _this.msgList = response.data;
            })
        }
        // Get List of Messages to Driver
        function getDriverMessages() {
            jobDetailFactory.getDriverMessages(_this.activeJobDetail.service.number).then(function (response) {
                _this.msgList = response.data;
            })
        }
        // Get List of Notes
        function getNotes() {
            jobDetailFactory.getNotesList(_this.activeJobDetail.service.number).then(function (response) {
                _this.notesList = response.data;
            })
        }
        function providerAction(jobNumber, provider) {
            jobDetailFactory.postProviderAction(jobNumber, provider, config.ACCEPTED_BY_PROVIDER).then(function (response) {
            })
        }
        // Change status of Job
        function sendChangeStatus(jobNumber) {
            var action, potentialId, type;
            action = returnStatusId(_this.statusSelected)
            if (action.flag === 'list') {
                if (action.value !== 'ReOpen' && action.value !== 'chargedCncl') {
                    jobDetailFactory.postProviderAction(jobNumber, _this.driverInfo[0], action.value).then(function (response) {
                        _this.statusSelected = null;
                        cancelConfirmationModal();
                        cancelJobChangeStatusPopUp();
                    })
                } else if (action.value === 'ReOpen') {
                    jobDetailFactory.putPotentialReasons(jobNumber, '', 'ReOpen').then(function (response) {
                        _this.statusSelected = null;
                        cancelConfirmationModal();
                        cancelJobChangeStatusPopUp();
                    })
                }
            } else if (action.flag === 'potential') {
                jobDetailFactory.putPotentialReasons(jobNumber, action.value).then(function (response) {
                    _this.statusSelected = null;
                    cancelConfirmationModal();
                    cancelJobChangeStatusPopUp();
                })
            } else if (action.flag === 'driverStatus') {
                jobDetailFactory.postProviderAction(jobNumber, _this.driverInfo[0], action.value).then(function (response) {

                    _this.statusSelected = null;
                    cancelConfirmationModal();
                    cancelJobChangeStatusPopUp();
                })

            }
        }
        // Return status id for particular changed status
        function returnStatusId(selectedStatus) {
            var id, lists, potentials, driverStatus, exist = true;
            for (lists in jobStatus.list) {
                if (selectedStatus === jobStatus.list[lists].name) {
                    id = {value: jobStatus.list[lists].actionId, flag: 'list'}
                    exist = false;
                    break;
                }
            }
            if (exist) {
                for (potentials in  _this.potentialReasons) {
                    if (selectedStatus === _this.potentialReasons[potentials].name) {
                        id = {value: _this.potentialReasons[potentials].id, flag: 'potential'}
                        exist = false;
                        break;
                    }
                }
            }
            if (exist) {
                for (driverStatus in jobStatus.driverOptions) {
                    if (selectedStatus === jobStatus.driverOptions[driverStatus].name) {
                        id = {value: jobStatus.driverOptions[driverStatus].actionId, flag: 'driverStatus'}
                        break;
                    }
                }
            }
            return id;
        }
        function sendCancelReason(jobNumber) {
            _this.cancelReasonSelected;
            var reasons, reasonValue;
            for (reasons in  _this.cancelReasons) {
                if (_this.cancelReasons[reasons].description === _this.cancelReasonSelected) {
                    reasonValue = _this.cancelReasons[reasons].id;
                    break;
                }
            }
            jobDetailFactory.getCancelByCustomer(jobNumber, reasonValue).then(function (response) {
            })
        }
        // Set changed job status
        function changeJobStatus(status, jobNumber) {
            _this.statusSelected = status;
            // cancelJobChangeStatusPopUp();
            showConfirmationModal('changeJobStatus');
            //sendChangeStatus(jobNumber)
        }
        //Set change job status
        function setChangeJobStatus(status, jobNumber) {
            _this.statusSelected = status;
        }
        //Set cancel by customer reason
        function selectedReason(reason) {
            _this.cancelReasonSelected = reason;
        }

        // Set selected driver status
        function setDriverStatus(status) {
            _this.selectedDriverStatus = status;
            showConfirmationModal('changeDriverStatus')
            // providerStatus(status,_this.activeJobDetail.service.number)
        }
        // Change Driver Status to On the way or On Site
        function providerStatus(status, jobNumber) {
            var actionId, driverStatus;
            for (driverStatus in jobStatus.driverOptions) {
                if (status === jobStatus.driverOptions[driverStatus].name) {
                    actionId = jobStatus.driverOptions[driverStatus].actionId
                    break;
                }
            }
            jobDetailFactory.postProviderAction(jobNumber, _this.driverInfo[0], actionId).then(function (response) {
                cancelConfirmationModal();
            })
        }
        // Get potential reasons for Change Status
        function getPotentials() {
            //jobStatus.getPotentialReasons().then(function(response){
            if (_this.potentialReasons.length > 0) {
                setJobStatus();
            } else {
                jobStatus.getPotentialReasons().then(function (response) {
                    setJobStatus();
                });
            }
        }
        // get list of potentials reason list only
        function  getPotentialsReasonOnly() {
            if (_this.potentialReasons.length > 0) {
                if (_this.activeJobDetail.service.potentialReason) {
                    getPotentialReasonName(_this.activeJobDetail.service.potentialReason);
                }
            }
        }

        // Set on the way and on site options
        function setDriverStatusOptions() {
            if (_this.activeJobDetail && _this.activeJobDetail.provider) {
                if (_this.activeJobDetail.provider.status === 1101) {
                    _this.driverStatusOptions.unshift(jobStatus.driverOptions['DOS'].name);
                    //selectedDriverStatus
                } else {
                    _this.driverStatusOptions.unshift(jobStatus.driverOptions['DOTW'].name);
                    _this.driverStatusOptions.unshift(jobStatus.driverOptions['DOS'].name);
                }
            }
        }
        // Set Job Status Change Options as per status of Job
        function setJobStatus() {
            var potentials;
            _this.jobStatus = [];
            for (potentials in _this.potentialReasons) {
                if (_this.potentialReasons[potentials].code !== undefined) { //  it is a potential reason
                    _this.jobStatus.push({value: _this.potentialReasons[potentials].name, visibility: true});
                }
            }
            if (_this.activeJobDetail.service.status === 3) {
                _this.jobStatus.unshift({value: jobStatus.list['CBP'].name, visibility: _this.isPermittedFeature('completeJob')}); // completed by provider
                _this.jobStatus.unshift({value: jobStatus.list['MG'].name, visibility: _this.isPermittedFeature('markedGOA')}); //Mark GOA
                _this.jobStatus.unshift({value: jobStatus.list['CBD'].name, visibility: _this.isPermittedFeature('cancelJobByDriver')}); //Cancel by Driver
                if (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status === 1101) {
                    _this.jobStatus.unshift({value: jobStatus.driverOptions['DOS'].name, visibility: _this.isPermittedFeature('diverStatus')});
                } else if (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status !== 1102) {
                    _this.jobStatus.unshift({value: jobStatus.driverOptions['DOTW'].name, visibility: _this.isPermittedFeature('diverStatus')});
                    _this.jobStatus.unshift({value: jobStatus.driverOptions['DOS'].name, visibility: _this.isPermittedFeature('diverStatus')});
                }

            }
            if (_this.activeJobDetail.service.status >= 8 && _this.activeJobDetail.service.status < 91) {
                //_this.jobStatus.unshift({value:jobStatus.list['CAT'].name,visibility:true}); //Close as TEST
            }
            if (_this.activeJobDetail.service.status == 91 || _this.activeJobDetail.service.status == 9 || _this.activeJobDetail.service.status == 21) {
                _this.jobStatus.unshift({value: jobStatus.list['RAD'].name, visibility: _this.isPermittedFeature('reOpenAutoAssign')}); //Reopen - Auto Assign Drivers
            }
            if (_this.activeJobDetail.provider && (_this.activeJobDetail.provider.phoneNumber || _this.activeJobDetail.provider.firstName || _this.activeJobDetail.provider.companyName)) {
                if (_this.activeJobDetail.service.status === 22 || _this.activeJobDetail.service.status === 21) {
                    _this.jobStatus.unshift({value: jobStatus.list['MG'].name, visibility: _this.isPermittedFeature('markedGOA')}); //Mark GOA
                    _this.jobStatus.unshift({value: jobStatus.list['CBP'].name, visibility: _this.isPermittedFeature('completeJob')}); // completed by provider
                }
            }
            if (_this.activeJobDetail.service.status === 93) {
                _this.jobStatus.unshift({value: jobStatus.list['CBP'].name, visibility: _this.isPermittedFeature('completeJob')}); // completed by provider
            }
        }
        //check cancellation condition
        function isCancelJobAllowed(jobNumber) {
            jobDetailFactory.jobCancellation(jobNumber).then(function (response) {
              loggingFactory.log(response);
              if(response.data) {
                _this.cancelJobCheck = response.data[0].condition;
                if (response.data[0].charge) {
                  _this.cancellationCharge = response.data[0].charge;
                }
              }
            })
        }
        //get assigned driver info
        function getDriverDetails(jobNumber) {
            jobDetailFactory.getDriverInfo(jobNumber).then(function (response) {
                _this.driverInfo = response.data;
            })
        }
        function getCancelList() {
            _this.cancelReasons = [];
            jobStatus.getCancelReasons().then(function (response) {
                _this.cancelReasons = response.data;
            })
        }
        function getCancelReasons() {
            var reasons;
            _this.cancelReasonsForCustomer = []
            for (reasons in _this.cancelReasons) {
                if (_this.cancelReasons[reasons].description !== undefined) { //  it is a potential reason
                    _this.cancelReasonsForCustomer.unshift(_this.cancelReasons[reasons].description); //ReOpen Job as Tow
                }
            }
        }
        function cardPayment(creditCardNo, expMonth, expYear, amount, jobNumber) {

        }
        function cashPayment(jobNumber) {
            jobDetailFactory.paymentWithCashOnly(jobNumber).then(function (response) {
            })
        }
        function thirdPartyPayment(jobNumber, price, token) {
            jobDetailFactory.thirdPartyPayment(jobNumber, price, token).then(function (response) {
            })
        }
        // To show date picker
        function showDatePicker(selector) {
            angular.element(selector).datepicker('show');
        }
        //Set selected tab for message/chat/notes modal
        function setSelectedTab(value) {
            _this.textMsg = null;
            _this.selectedTab = value;
            switch (value) {
                case 'messageToCustomer':
                {
                    _this.isChatOpen = false;
                    getCustomerMessages();
                    getCannedMessages('Customer');
                    break;
                }
                case 'messageToDriver':
                {
                    _this.isChatOpen = false;
                    getDriverMessages();
                    getCannedMessages('Driver');
                    break;
                }
                case 'notes':
                {
                    _this.isChatOpen = false;
                    getNotes();
                    break;
                }
                case 'chat':
                {
                    _this.isChatOpen = true;
                    _this.chatSummary = [];
                    pubnub.getHistory(userData.chatChannel, config.CHATHISTORYCOUNT);
                    $timeout(function () {
                        if (angular.element('#chatDiv')[0]) {
                            angular.element('#chatDiv')[0].scrollTop = '9999999';
                        }
                    }, 100);
                    break;
                }
                // htang : Case statement for partner chat.
                case 'partnerChat':
                {
                    _this.isChatOpen = true;
                    _this.chatSummary = [];
                    $timeout(function () {
                        if (angular.element('#chatDiv')[0]) {
                            angular.element('#chatDiv')[0].scrollTop = '9999999';
                        }
                    }, 100);
                    break;
                }
            }
            openMsgNotesChatModal();
        }
        //Set tab for event log
        function setEventLogTab(value) {
            _this.selectedEventLogTab = value;
            switch (value) {
                case 'jobEventLog':
                {
                    jobEventsLog(_this.activeJobDetail.service.number);
                    break;
                }
                case 'alertEventLog':
                {
                    alertEventsLog(_this.activeJobDetail.service.number);
                    break;
                }
                case 'jobLog':
                {
                    _this.allLog = [];
                    jobLog(_this.activeJobDetail.service.number);
                    break;
                }
            }
            openJobEventLogModal();
        }


        //Get all eventLogs,AlertLogs,Text to customer,Text to driver,Notes
        function jobLog(jobNumber, offset, limit) {
            //  _this.allLog = [];
            notification.showLoading();
            jobDetailFactory.getCustomerMessages(_this.activeJobDetail.service.number).then(function (response) {
                if (response.data.length > 0) {
                _this.msgListCustomer = response.data;
                if (_this.msgListCustomer) {
                    angular.forEach(_this.msgListCustomer, function (job) {
                        job.messageType = "customer";
                        job.createdAtTimeStamp = new Date().getTime();
                        _this.allLog.push(job);
                    });
                }
                }
                jobDetailFactory.getDriverMessages(_this.activeJobDetail.service.number).then(function (response) {
                    if (response.data.length > 0) {
                    _this.msgListDirver = response.data;
                    if (_this.msgListDirver) {
                        angular.forEach(_this.msgListDirver, function (job) {
                            job.messageType = "driver";
                            job.createdAtTimeStamp = new Date().getTime();
                            _this.allLog.push(job);
                        });
                    }
                    }
                    jobDetailFactory.getNotesList(_this.activeJobDetail.service.number).then(function (response) {
                        if (response.data.length > 0) {
                        _this.notesListAll = response.data;
                        if (_this.notesListAll) {
                            angular.forEach(_this.notesListAll, function (job) {
                                job.messageType = "notes";
                                job.createdAtTimeStamp = new Date().getTime();
                                _this.allLog.push(job);
                                });
                            }
                        }
                        jobDetailFactory.getJobEventLog(jobNumber, 0, 200).then(function (response) {
                            if (response.data.length > 0) {
                                _this.eventListALL = response.data;
                                angular.forEach(_this.eventListALL, function (job) {
                                    job.messageType = "eventLogs";
                                    job.createdAt = job.ts;
                                    _this.allLog.push(job);
                                loggingFactory.log(_this.allLog);
                            });
                        }
                            jobDetailFactory.getAlertEventsLog(jobNumber, 0, 200).then(function (response) {
                                notification.hideLoading();
                                if (response.data.length > 0) {
                                    angular.forEach(response.data, function (job) {
                                        job.messageType = "alertLogs";
                                        _this.allLog.push(job);
                    });
                                }
                            }, function (response) {
                                notification.hideLoading();
                                exceptionFactory.catchException('Error in getting ALERT JOB ->', response);
                                notification.showError(response.error);
                });
                        }, function (response) {
                            notification.hideLoading();
                            exceptionFactory.catchException('Error in getting Event JOB ->', response);
                            notification.showError(response.error);
            });
                    }, function (response) {
             notification.hideLoading();
                        exceptionFactory.catchException('Error in getting Notes ->', response);
                        notification.showError(response.error);
             });
                }, function (response) {
             notification.hideLoading();
                    exceptionFactory.catchException('Error in getting Driver Text ->', response);
                    notification.showError(response.error);
             });
             }, function (response) {
             notification.hideLoading();
                exceptionFactory.catchException('Error in getting Customer Text ->', response);
             notification.showError(response.error);
            });
        }

        // Tracking status
        function getTrackingStatus(jobNumber) {
            if (_this.activeJobDetail.provider) {
                jobDetailFactory.getTrackingStatus(jobNumber).then(function (response) {
                    _this.trackingStatus.status = response.data[0].status;
                    if (response.data[0].providerType === "native") {
                        _this.trackingStatus.isApp = "Yes";
                    } else if (response.data[0].providerType === "locationsmart") {
                        _this.trackingStatus.statusNumber = response.data[0].status;
                        _this.trackingStatus.isApp = "No";
                    } else if (response.data[0].providerType === "platform") {
                        _this.trackingStatus.status = "GPS Device";
                    } else {
                        _this.trackingStatus.isApp = "No";
                    }
                })
            }
        }

        //get smart location
        function getSmartLocation() {
            jobDetailFactory.getSmartLocation(_this.activeJobDetail.provider.phoneNumber).then(function (response) {
                loggingFactory.log("response");
            });
        }

        // Set Dispatch Event
        function setDispatchEvent(selectedDispatchEvent) {
            _this.selectedDispatchEvent = selectedDispatchEvent;
            //_this.dispatchValue.min =
            //   _this.dispatchEventResponse = response.data;
            loggingFactory.log(_this.dispatchEventResponse)
            if (_this.dispatchEventResponse) {
                for (var x = 0; x < _this.dispatchEventResponse.length; x++) {
                    if (_this.dispatchEventResponse[x].param === selectedDispatchEvent.key) {
                        if (_this.selectedDispatchEvent.key === 3 || _this.selectedDispatchEvent.key === 4) {
                            var myStr = _this.dispatchEventResponse[x].value;
                            var date = myStr.substring(3, myStr.indexOf('00:'));
                            var i = myStr.indexOf('e)') + 3;
                            var ix = myStr.lastIndexOf(':');
                            var hr = myStr.substring(i, ix);
                            var min = myStr.substring((myStr.length) - 2, myStr.length);
                            _this.dispatchValue.date = date;
                            _this.dispatchValue.hr = hr;
                            _this.dispatchValue.min = min;
                        } else {
                            _this.dispatchValue.min = _this.dispatchEventResponse[x].value;
                        }
                        break;
                    }
                }
            }
        }
        // On Job PubNub
        function onJobPubnub(event, response) {
            var data = response;
            if (data.service.number === _this.activeJobDetail.service.number) {
                jobDetailFactory.getJobDetail(_this.activeJobDetail).then(function (response) {
                    angular.merge(_this.activeJobDetail, response.data[0]);
                    /*if(_this.activeJobDetail && _this.activeJobDetail.service){
                     dispatchUtilityFactory.jobAlert(_this.activeJobDetail.service.status);
                     }*/
                    if (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status) {
                        _this.statusText = jobDetailFactory.returnJobStatus(_this.activeJobDetail.service.status, _this.activeJobDetail.provider.status);
                    } else {
                        _this.statusText = jobDetailFactory.returnJobStatus(_this.activeJobDetail.service.status);
                    }
                    if (_this.activeJobDetail.service.status == 200) {
                        _this.potentialStatusText = _this.statusText;
                        getPotentialsReasonOnly();
                    }
                    _this.mapObj.setPosition(_this.mapObj.marker, data.location.latitude, data.location.longitude);
                    _this.activeJobDetail.personalInfo.formattedphone = jobDetailFactory.formatPhoneNumber(_this.activeJobDetail.personalInfo.phone, $rootScope.internationData.countryIsoCode);
                    if (_this.activeJobDetail.provider) {
                        plotProviderMarker();
                    }
                    if ($rootScope.internationData.countryIsoCode === 'AU') {
                        if (_this.activeJobDetail.provider) {
                            if (_this.activeJobDetail.provider.status === 1102) {
                                _this.cancelJobAsOnSite = true;
                            }
                        }
                    }
                    //_this.isCancelJob = _this.cancelJobAsOnSite ||
                    _this.isCancelJob = _this.cancelJobAsOnSite || _this.activeJobDetail.service.status === 8 || _this.activeJobDetail.service.status === 9 || _this.activeJobDetail.service.status === 21 || _this.activeJobDetail.service.status === 22 || _this.activeJobDetail.service.status === 24 || _this.activeJobDetail.service.status === 28 || _this.activeJobDetail.service.status === 200 || _this.activeJobDetail.service.status === 102 || (_this.activeJobDetail.service.status > 90 && _this.activeJobDetail.service.status <= 100 && _this.activeJobDetail.service.status != 93);// eslint-disable-line
                    setJobStatus();
                    if (_this.activeJobDetail.service.status === 3 || _this.activeJobDetail.service.status === 9 || _this.activeJobDetail.service.status === 21 ||
                            _this.activeJobDetail.service.status === 91 || (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status === 1101) || (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status === 1102)) {
                        if (userData.authority !== 'ROLE_DISPATCH') {
                            getDriverDetails(_this.activeJobDetail.service.number);
                        }

                    }
                    //   _this.isCancelJob = _this.activeJobDetail.service.status === 8 ||_this.activeJobDetail.service.status === 9 || _this.activeJobDetail.service.status === 21 || _this.activeJobDetail.service.status === 22 ||_this.activeJobDetail.service.status === 24 || _this.activeJobDetail.service.status === 200 || (_this.activeJobDetail.service.status>90 && _this.activeJobDetail.service.status <= 100);// eslint-disable-line
                    if (!((_this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider && _this.activeJobDetail.provider.status === 1101) || (_this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider && _this.activeJobDetail.provider.status !== 1102))) {
                        var custMarker = [];
                        custMarker.push(_this.mapObj.fitMarkerOnMap(markerList));
                        //_this.mapObj.removeMarker(_this.mapObj.driverMarker);
                        _this.mapObj.fitMarkerOnMap(custMarker);
                    }

                    if (_this.activeJobDetail.provider && (_this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider.status === 1101) || (_this.activeJobDetail.service.status === 3 && (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status !== 1102))) {
                        _this.beginProviderAnimation();
                    }

                    if (_this.activeJobDetail.provider && _this.activeJobDetail.provider.status === 1102 && _this.activeJobDetail.service.status === 3) {
                      if(_this.mapObj.customerLocation != null) {
                        _this.mapObj.driverMarker.setPosition(_this.mapObj.customerLocation);
                      }
                        _this.mapObj.cancelTimer();
                    }

                    if (_this.activeJobDetail.provider) {
                        _this.activeJobDetail.provider.driverFormattedphone = _this.activeJobDetail.provider.phoneNumber ? jobDetailFactory.formatPhoneNumber(_this.activeJobDetail.provider.phoneNumber, $rootScope.internationData.countryIsoCode) : '';
                        _this.activeJobDetail.provider.companyFormattedphone = _this.activeJobDetail.provider.dispatchPhone ? jobDetailFactory.formatPhoneNumber(_this.activeJobDetail.provider.dispatchPhone, $rootScope.internationData.countryIsoCode) : '';
                    }
                    utilityFactory.isPermittedFeature('trackingStatus') ? getTrackingStatus(_this.activeJobDetail.service.number) : false;
                    if (_this.activeJobDetail.provider) {
                        if (_this.activeJobDetail.service.status === 3 && _this.activeJobDetail.provider.status === 1101) {
                            if(userData.authority !== 'ROLE_DISPATCH'){
                                utilityFactory.isPermittedFeature('cancelWithCharge') ? isCancelJobAllowed(_this.activeJobDetail.service.number) : false;
                            }

                        }
                    }
                }, function () {

                });

                $scope.$apply();
            }
        }

        // set Payment options
        function setPaymentType(paymentType) {
            loggingFactory.log('--- Payment Type ---', paymentType);
            _this.paymentTypeSelected = paymentType.id;
            if (type === 'Credit Card') {
                _this.paymentInstrumentType = config.CREDITCARDPAYMENT;
            } else if (type === 'Third Party Payment') {
                _this.paymentInstrumentType = config.PARTNERPAYMENT;
            }
        }

        // Get dispatch event
        function getDispatchEvent(jobNumber) {
            //_this.dispatchEventResponse = null;
            jobDetailFactory.getDispatchEvents(jobNumber).then(function (response) {
                loggingFactory.log("response.data ", response.data.length);
                var length = response.data.length;
                if (length > 0) {
                  for (var l = 0; l < length; l++) {
                    if (response.data[l].param === 1) {
                      _this.activeJobDetail.provider.eta.duration = response.data[l].value;
                      _this.activeJobDetail.provider.eta.updateAt = response.data[l].updatedAt;

                    } else if (response.data[l].param === 2) {
                      _this.ataValue.value = response.data[l].value;
                      _this.ataValue.lastUpdatedAt = response.data[l].updatedAt;
                    }
                  }
                }
            });
        }
        // Update dispatch events
        function postDispatchEvent(jobNumber, param, value) {

            if (value) {
                jobDetailFactory.postDispatchEvent(jobNumber, param, value).then(function (response) {
                    cancelUpdateTimingModal();
                    _this.dispatchValue = null;
                    getDispatchEvent(jobNumber);
                    _this.activeJobDetail.eta = (value.min != null) ? value.min + " mins" : value.min;
                    if (_this.activeJobDetail.provider) {
                        if (_this.activeJobDetail.provider.eta) {
                            _this.activeJobDetail.provider.eta.receivedAt = new Date().getTime();
                           // _this.activeJobDetail.provider.eta.duration = value.min;
                            //_this.activeJobDetail.updatedAt = getTimeFromTimeStamp(_this.activeJobDetail.provider.eta.updateAt);
                            _this.activeJobDetail.updatedAt = getTimeFromTimeStamp(_this.activeJobDetail.provider.eta.receivedAt);
                        }

                    }
                });
            }

        }
        // To put job on secalation
        function escalateJob(jobNumber) {
            jobDetailFactory.escalateJob(jobNumber).then(function (response) {
                cancelConfirmationModal();
            })
        }

        //set map to center as per location
        function setMapToLocation(location) {
            _this.mapObj.setCenter(new google.maps.LatLng(location.latitude, location.longitude), true);
        }

        //open find provder and all provider list
        function openFindProviderPopup() {
            var modalInstanceFindProvider = $uibModal.open({
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/findprovider/findProvider.template.html',
                controller: 'findProvider.controller',
                controllerAs: 'findProvider',
                windowTopClass: 'find-provider-popup',
                resolve: {
                    'getProviderList': ['serverApi', 'config', 'dataUrl', 'notification.factory', function (serverApi, config, dataUrl, notification) {
                            var getProviderListUrl;
                            notification.showLoading();
                            dataUrl.jobs.jobNumber = activeJobListDetail.service.number;
                            getProviderListUrl = config.SERVER_ADDRESS + dataUrl.jobs.GETPOTENTIALPROVIDERS + '?limit=6&offset=0';
                            return serverApi.getData(getProviderListUrl, true);
                        }],
                    'getDeclineReason': ['serverApi', 'config', 'dataUrl', 'notification.factory', function (serverApi, config, dataUrl, notification) {
                            var getDeclineReasonUrl;
                            notification.showLoading();
                            dataUrl.jobs.jobNumber = activeJobListDetail.service.number;
                            getDeclineReasonUrl = config.SERVER_ADDRESS + dataUrl.jobs.DECLINEREASON;
                            return serverApi.getData(getDeclineReasonUrl, true);
                        }],
                    'activeJobDetail': function () {
                        return _this.activeJobDetail;
                    }
                }
            });
        }
        //Show confirmation Modal
        function showConfirmationModal(action) {
            //_this.selectedTab = value;
            _this.actionConfirmed = action;
            switch (action) {
                case 'changeJobStatus':
                {
                    _this.confirmActionHeading = 'Save Changes';
                    _this.confirmActionLabel = "You have updated the job status. Are you sure you want to save these changes?";
                    break;
                }
                case 'changeDriverStatus':
                {
                    _this.confirmActionHeading = 'Save Changes';
                    _this.confirmActionLabel = "You have updated the driver status. Are you sure you want to save these changes?";
                    break;
                }
                case 'escalateJob':
                {
                    _this.confirmActionHeading = 'Escalate Job';
                    _this.confirmActionLabel = "Are you sure you want to escalate the job?";
                    break;
                }
            }
            openConfirmationModal();
        }
        //
        function takeAction(jobNumber) {
            loggingFactory.log('Take action : ' + _this.actionConfirmed)
            switch (_this.actionConfirmed) {
                case 'escalateJob':
                {
                    escalateJob(jobNumber);
                    break;
                }
                case 'changeDriverStatus':
                {
                    providerStatus(_this.selectedDriverStatus, _this.activeJobDetail.service.number)
                    break;
                }
                case 'changeJobStatus':
                {
                    sendChangeStatus(_this.activeJobDetail.service.number);
                    break;
                }
            }
        }

        //show world pay form
        function showWorldPayForm() {
            _this.worldPayPrice = _this.worldPayPrice ? _this.worldPayPrice : _this.activeJobDetail.service.price;
            notification.showLoading();
            jobDetailFactory.getRedirectionUrl(_this.activeJobDetail.service.number, config.enviroment, _this.worldPayPrice).then(function (response) {
                notification.hideLoading();
                var redirectUrl = response.data[0];
                $('#worldPayCont').html('<iframe style="width:100%;height:100%;" src="scripts/modules/home/content/csr/jobdetail/worldpay/test.html#urgently=' + redirectUrl + '"></iframe>');
            }, function () {
                notification.hideLoading();
            });

        }


        //action to be taken when user cancels worldpay payment
        function cancelWorldPayPopUp() {
            jobDetailFactory.reactiveRecentCard(_this.activeJobDetail.service.number);
            if (modalInstanceCustomerPayment) {
                modalInstanceCustomerPayment.dismiss('cancel');
            }
        }

        // Set payment type
        function setSelectedPaymentType(payment) {
            _this.customerPaymentType = payment;
            _this.paymentInstrumentType = payment.id;
            if (_this.customerPaymentType.category === 'worldpay') {
                showWorldPayForm();
            }
        }

        //clone current job
        function cloneCurrentJob(jobDetailData) {
            var paymentInfo;
            if (_this.customerPaymentType && _this.customerPaymentType.type) {
                if (_this.customerPaymentType.type === 'Third Party Payment') {
                    paymentInfo = {'type': _this.customerPaymentType.type, 'id': _this.internalRecordId};
                } else {
                    paymentInfo = {'type': _this.customerPaymentType.type};
                }
            } else {
                paymentInfo = {type: 'Third Party Payment'};
            }

            $scope.$emit('cloneCurrentJob', jobDetailData, paymentInfo);
            cancel();
        }

        // Get Customer Canned Messages
        function getCannedMessages(messageFor) {
            _this.selectedCannedMsg = null;
            // if(_this.activeJobDetail.service.status === 3){
            jobDetailFactory.getCannedMessages(messageFor).then(function (response) {
                _this.cannedMessageList = response.data;
            })
            //}
        }
        //Set selected canned message
        function setSelectedCannedMessage(cannedMsg) {
            _this.selectedCannedMsg = cannedMsg;
            _this.textMsg = null;
            jobDetailFactory.getCannedMsgFormat(_this.activeJobDetail.service.number, cannedMsg.id).then(function (response) {
                _this.sendCannedMsg = true;
                _this.cannedMsg = response.data[0];
                _this.textMsg = _this.cannedMsg.value;
            })
        }
        //Put canned messages
        function putCannedMessages(jobNumber, messageId, message) {
            jobDetailFactory.putCannedMessages(jobNumber, messageId, message).then(function (response) {
                _this.textMsg = null;
                if (_this.selectedTab === 'messageToCustomer') {
                    getCustomerMessages();
                } else {
                    getDriverMessages();
                }
            })
        }

        /**
         * Function set/uset current selected provider type
         * @param {string} providerCost type selected provider cost type (other/toll/base/empty when we want to unset the valye).
         */
        function setOtherProviderPayment(providerCost) {
            _this.selectedOtherProviderCost = providerCost;
        }

        /**
         * Function will add/update costs in job detail costs object.
         * @param {number} key would be -1 when wants to add data to object, actual key when we want to edit the value inside costs object.
         * @param {string} type selected provider cost type (other/toll/base etc).
         * @param {number} price provider cost.
         */
        function addUpdateOtherProviderPayment(key, type, price) {
            if (_this.isValidOtherProviderPaymentForm() === false) {
                return false;
            }
            var otherProviderCosts = _this.otherProviderCostCopy;
            if (otherProviderCosts && otherProviderCosts[key]) {
                otherProviderCosts[key] = {"type": type.bEndName, "price": parseFloat(price)};
            } else if (type !== "" || price !== "") {
                otherProviderCosts.push({"type": type, "price": parseFloat(price)});
                setOtherProviderPayment("");
                _this.amount = "";
            }
        }

        /**
         * Function will validate other provider payment form.
         */
        function isValidOtherProviderPaymentForm() {
            var isValid;

            if ((_this.selectedOtherProviderCost === "" || _this.selectedOtherProviderCost === undefined) && (_this.amount === "" || _this.amount === undefined)) {
                _this.isInValidProviderCostType = true;
                _this.isInValidAmount = true;
                return false;
            }

            if (_this.selectedOtherProviderCost === "" || _this.selectedOtherProviderCost === undefined) {
                _this.isInValidProviderCostType = true;
                isValid = false;
            }
            if (_this.amount === "" || _this.amount === undefined) {
                _this.isInValidAmount = true;
                isValid = false;
            }

            return isValid;
        }


        /**
         * Function will remove costs from job detail object.
         * @param {number} key to be removed from other provider costs object.
         */
        function removeOtherProviderPayment(key) {
            if (_this.otherProviderCostCopy && _this.otherProviderCostCopy[key]) {
                _this.otherProviderCostCopy.splice(key, 1);
            }
        }

        /**
         * Function will update other provider costs on for current job server.
         */
        function updateOtherProviderPayment() {
            var otherPaymentProviderByTypes = [];
            var type, price = "", inValid = false;

            if (_this.selectedOtherProviderCost === "" || _this.selectedOtherProviderCost === undefined) {
                if (_this.amount !== "" && _this.amount !== undefined) {
                    _this.isInValidProviderCostType = true;
                    inValid = true;
                }
            } else if (_this.amount === "" || _this.amount === undefined) {
                if (_this.selectedOtherProviderCost !== "" || _this.selectedOtherProviderCost !== undefined) {
                    _this.isInValidAmount = true;
                    inValid = true;
                }
            }

            if (inValid == true) {
                return false;
            }

            if (_this.selectedOtherProviderCost !== "" && _this.amount !== "" && _this.selectedOtherProviderCost !== undefined && _this.amount !== undefined) {
                type = _this.selectedOtherProviderCost.bEndName;
                price = _this.amount;
                _this.addUpdateOtherProviderPayment(-1, type, price);
                type = price = "";
            }
            for (var i = 0; i < _this.otherProviderCostCopy.length; i++) {
                type = _this.otherProviderCostCopy[i]["type"];
                price = _this.otherProviderCostCopy[i]["price"];
                if (price === "") {
                    return false;
                }
                otherPaymentProviderByTypes.push({"type": type, "price": parseFloat(price)});
            }

            _this.isSaving = true;
            var jobID = _this.activeJobDetail.service.id;
            //if(otherPaymentProviderByTypes.length > 0){
            notification.showLoading();
            jobDetailFactory.bulkUpdateOtherProviderPayment(jobID, otherPaymentProviderByTypes).then(function (response) {
//          if(response === ""){
//            modalInstanceOtherProviderPayment.dismiss('cancel');
//          }
                _this.activeJobDetail.provider.costs = otherPaymentProviderByTypes;
                _this.initialOtherProviderCostCopy = angular.copy(otherPaymentProviderByTypes);

            }, function () {
                _this.isOtherPaymentProviderUpdateError = true;
                notification.hideLoading();
            }, function (status) {
                if (status === 200) {
                    modalInstanceOtherProviderPayment.dismiss('cancel');
                }
                notification.hideLoading();
            });
            // }
        }

        /**
         * Function will return provider cost lable
         * @param {string} type of lable for which we want lable.
         * @return {string} return cost type lable from factory
         */
        function returnOtherProviderCostLable(type) {
            return jobDetailFactory.providerCostTypes(type);
        }


        // Update provider payment
        function updateProviderPayment(jobNumber, price, type) {
            var price = parseInt(price);
            jobDetailFactory.updateProviderPayment(jobNumber, price, type).then(function (response) {

            }, function () {

            }, function (status) {
                if (status === 200) {
                   // _this.serviceProviderCost = {type: 'BASE', price: price};
                    modalInstanceProviderPayment.dismiss('cancel');
                }
            });
        }

        //Alert status
        function setAlertStatus(status) {
            return jobDetailFactory.returnAlertStatus(status);
        }

        //on payment done successfully
        function onPaymentValidate(event, data) {
            if (data.service.number === _this.activeJobDetail.service.number) {
                jobDetailFactory.getPaymentInstrument(_this.activeJobDetail).then(function (response) {
                    getPaymentInstrument = response;
                    _this.paymentInstrument = getPaymentInstrument ? getPaymentInstrument.data[0] : '';
                    getPaymentInfo();
                }, function () {

                });
            }
        }

        // Get Location functionality
        function getLocation(phone) {
            phone = (phone).toString().match(/\d+/g).join('');
            var countryCode = _this.countryPhoneCode;
            addJobFactory.getLocation(phone, countryCode).then(function (response) {
                var channel = 'urgently_' + phone;
                pubnub.subscribeLocator(channel);
            }, function (response) {

            });
        }

        function unsubscribeGetLocationChannel() {
            var phone = _this.activeJobDetail.personalInfo.phone;
            var channel = 'urgently_' + phone;
            pubnub.unSubscribePubnub(channel);
        }

        function onGetAddressFromPhone(event, data) {
            loggingFactory.log(data);
            saveVehicleLocPopup(data, _this.activeJobDetail.service.number, true);
        }

        // Provider payment types
        function providerPaymentTypes() {
            jobDetailFactory.getProviderPaymentTypes().then(function (response) {
                _this.otherProviderCost = response;
            }, function () {

            });
        }

        //Open ETA/ATA update timing modal
        function openDispatchModal(value) {
            //_this.dispatchValue = null;
            if (value === 'ETA') {
                _this.updateTimingHeading = 'Update ETA Timing';
                _this.updateTimingLabel = 'Enter the new estimated time of arrival.';
                _this.dispatchEvents = {key: 1, value: 'Estimated Time Of Arrival'}

            } else if (value === 'ATA') {
                _this.updateTimingHeading = 'Update ATA Timing';
                _this.updateTimingLabel = 'Enter the new actual time of arrival.';
                _this.dispatchEvents = {key: 2, value: 'Actual Time Of Arrival'}
            }
            openUpdateTiming();
        }

        //dismiss modal
        function dismissCustomerPricePopup() {
            modalInstanceCustomerPrice.dismiss('cancel');
        }

        //dismiss modal
        function dismissWorldPayPopup() {
            if (_this.customerPaymentType && _this.customerPaymentType.category === 'worldpay') {
                _this.customerPaymentType = _this.customerPaymentTypeCopy;
                modalInstanceWorldPayment.dismiss('cancel');
                cancelWorldPayPopUp();
            }
        }

        function getTimeFromTimeStamp(timestamp) {
            var d = new Date(timestamp)
            var hours = d.getHours();
            var minutes = d.getMinutes();

            var ampm = hours >= 12 ? 'p.m.' : 'a.m.';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return hours + ":" + minutes + " " + ampm;
        }

        //open refund pop up
        function openRefundPopUp() {
            modalInstanceRefund = $uibModal.open({
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/csr/jobdetail/refund/refund.template.html',
                controller: 'refund.controller',
                controllerAs: 'refund',
                windowClass: 'modalEditTeamMember InputCretCardPopup alertUpdateTimingPopUp',
                resolve: {
                    'activeJobDetail': function () {
                        return _this.activeJobDetail;
                    }
                }
            });
        }

        function getRefundStatus(jobNumber) {
            refundFactory.getRefundStatus(jobNumber).then(function (response) {
                if (response && response.data) {
                    _this.activeJobDetail.refund = {"status": response.data[0].statusId};
                }
            }, function () {

            });
        }


        // Update job status on pubub for AUS
        function updateJobStatusOnPubNub(event, data) {
            if ($rootScope.internationData.countryIsoCode === 'AU') {
                if (data === 3053) {
                    _this.statusText = 'Job Failed - unsupported vehicle';
                } else if (data === 3054) {
                    _this.statusText = 'Job Failed - card refused';
                } else if (data === 3055) {
                    _this.statusText = 'Job Expired - no payment added';
                }
            }

        }

        //validate job on load
        function getUnvalidateRulesOfJob(jobNumber) {
            notification.showLoading();
            dataValidationFactory.getUnvalidRulesOfJob(jobNumber).then(function (response) {
                notification.hideLoading();
                if (!response.content.length) {
                    _this.isValidated = true;
                    _this.validationHeader = 'VALIDATED';
                }
                angular.forEach(response.content, function (job) {
                    if (!job.closedAt) {
                        _this.unValidatedRules.push(job);
                    }
                });
                // _this.unValidatedRules = response.content;
                _this.unValidatedRulesName = _this.unValidatedRules.map(function (job) {
                    return job.type
                });
                angular.forEach(_this.unValidatedRules, function (job) {
                    _this.showValidatedCheckbox[job.type] = {};
                    _this.showValidatedCheckbox[job.type].value = false;
                });
            }, function () {
                notification.hideLoading();
            });

        }
        //close validation on header
        function jobLevelValidation(jobNumber, checkBox) {
            _this.isValidated = checkBox;
            if (_this.isValidated === true) {
                dataValidationFactory.closeJobValidation(jobNumber).then(function (response) {
                    _this.isValidated = true;
                    _this.validationHeader = 'VALIDATED';
                    // _this.validatedTimeStamp = new Date();
                    for (var i = 0; i < _this.unValidatedRules.length; i++) {
                        _this.showValidatedCheckbox[_this.unValidatedRules[i].type].value = true;
                        _this.showValidatedCheckbox[_this.unValidatedRules[i].type].validatedBy = userData.name;
                        _this.showValidatedCheckbox[_this.unValidatedRules[i].type].validatedAt = new Date();
                    }
                    if (_this.isPaymentSectionInValid) {
                        _this.isPaymentSectionInValid = false;
                        _this.isPaymentSectionValid = true;
                    }
                    if (_this.isJobSectionInValid) {
                        _this.isJobSectionInValid = false;
                        _this.isJobSectionValid = true;
                        // _this.isJobSectionInValid= false;
                    }
                    _this.unValidatedRulesName = [];
                }, function () {

                });

            } else if (_this.isValidated === false) {
                dataValidationFactory.manualUnvalidation(jobNumber).then(function (response) {
                    _this.validationHeader = 'VALIDATE';
                    loggingFactory.log("manual unvalidation")
                }, function () {

                });
            }

        }
        //close validation on header
        function closeCheckValidation(rule) {

            if (_this.showValidatedCheckbox[rule].value) {
                unvalidateJobRule(rule);
            } else {
                var jobArray = [];
                var paymentArray = [];
                for (var i = 0, y = 0, z = 0; i < _this.unValidatedRules.length; i++) {
                    if (_this.unValidatedRules[i].type === 'POTENTIAL' || _this.unValidatedRules[i].type === 'GOA') {
                        jobArray[y] = _this.unValidatedRules[i].type;
                        y++;
                    } else
                    {
                        if (!(_this.unValidatedRules[i].type === 'INCORRECT_PROVIDER_COST')) {
                            paymentArray[z] = _this.unValidatedRules[i].type;
                            z++;
                        }
                    }
                }

                var selectedInvalidRule = _this.unValidatedRules[_this.unValidatedRules.map(function (invalidRule) {
                    return invalidRule.type;
                }).indexOf(rule)];
                dataValidationFactory.closeCheckValidation(selectedInvalidRule.id).then(function (response) {
                    _this.showValidatedCheckbox[rule].value = true;
                    _this.showValidatedCheckbox[rule].validatedBy = userData.name;
                    _this.showValidatedCheckbox[rule].validatedAt = new Date();
                    if (paymentArray.length) {
                        var count = 0;
                        for (var i = 0; i < paymentArray.length; i++) {
                            if (_this.showValidatedCheckbox[paymentArray[i]].value) {
                                count++;
                            }
                        }
                        if (count === paymentArray.length) {
                            _this.isPaymentSectionInValid = false;
                            _this.isPaymentSectionValid = true;

                        }
                    }
                    if (jobArray.length) {
                        var count = 0;
                        for (var i = 0; i < jobArray.length; i++) {
                            if (_this.showValidatedCheckbox[jobArray[i]].value) {
                                count++;
                            }
                        }
                        if (count === jobArray.length) {
                            _this.isJobSectionInValid = false;
                            _this.isJobSectionValid = true;

                        }
                    }
                    var countRule = 0;
                    for (var i = 0; i < _this.unValidatedRules.length; i++) {

                        if (_this.showValidatedCheckbox[_this.unValidatedRules[i].type].value) {
                            countRule++;
                        }
                    }
                    if (countRule === _this.unValidatedRules.length) {
                        _this.isValidated = true;
                        _this.validationHeader = 'VALIDATED';
                    }

                    //if(_this.isPaymentSectionValid)
                    if (_this.unValidatedRulesName.indexOf(rule) !== -1) {
                        _this.unValidatedRulesName.splice(_this.unValidatedRulesName.indexOf(rule), 1);
                    }
                    _this.validatedRules.push(selectedInvalidRule);
                }, function () {

                });
            }
        }
        //show toolTip
        function showToolTip(event) {
            _this.isToolTip = true;
        }
        //hide toolTip
        function hideToolTip(event) {
            _this.isToolTip = false;
        }
        //Check rule applied for job
        function isRuleApplied(rule, invalidRuleList) {

            var exist = dataValidationFactory.isRuleApplied(rule, invalidRuleList);
            if (exist) {
                var customerInfoValidateRules = ['POTENTIAL', 'GOA'];
                var paymentValidation = ['TOO_HIGH_CUSTOMER_PRICE', 'MISC_COST', 'INCORRECT_PROVIDER_EXTRA_COST', 'TOO_HIGH_PROVIDER_COST'];
                if (customerInfoValidateRules.indexOf(rule) !== -1) {
                    if (_this.unValidatedRulesName.indexOf(rule) !== -1) {
                        _this.isJobSectionInValid = true;
                        _this.isJobSectionValid = false;
                        return exist;
                    } else {
                        return exist;
                    }
                }
                if (paymentValidation.indexOf(rule) !== -1) {
                    if (_this.unValidatedRulesName.indexOf(rule) !== -1) {
                        _this.isPaymentSectionInValid = true;
                        _this.isPaymentSectionValid = false;
                        return exist;
                    } else {
                        return exist;
                    }
                }
            } else {
                return exist;
            }
        }
        //GET validated rules for a job
        function getValidatedRulesOfJob(jobNumber) {
            var temp;
            dataValidationFactory.getValidRulesOfJob(jobNumber).then(function (response) {
                for (var i = 0, z = 0, p = 0; i < response.content.length; i++) {
                    if (response.content[i].closedAt) {
                        temp = {"type": response.content[i].type, "id": response.content[i].id, "action": response.content[i].histories[p].action,
                            'validatedBy': response.content[i].histories[p].name, 'validatedAt': response.content[i].histories[p].timestamp};
                        _this.validatedRules.push(temp);
                        if (temp.action === 'VALIDATED') {
                            _this.showValidatedCheckbox[temp.type] = {};
                            _this.showValidatedCheckbox[temp.type].value = true;
                            _this.showValidatedCheckbox[temp.type].validatedBy = temp.validatedBy;
                            _this.showValidatedCheckbox[temp.type].validatedAt = temp.validatedAt;

                        }
                    }

                }
            })
        }
        //Get validation hostory
        function getValidationHistory(jobNumber) {
            var temp;

            dataValidationFactory.getValidationHistory(jobNumber).then(function (response) {
                for (var i = 0, z = 0, p = 0; i < response.length; i++) {
                    if (response[i].histories.length) {
                        for (var y = 0; y < response[i].histories.length; y++) {
                            _this.validationHistory[z] = response[i].histories[y];
                            z++;
                        }


                    }
                }

            })
            // loggingFactory.log("Respnse jjuj ",_this.validatedRules)
        }
        //get validation time and validated by
        function getValidByNTime(rule) {
            if (_this.validatedRules) {
                var selectedValidRule = _this.validatedRules[_this.validatedRules.map(function (validRule) {
                    return validRule.type;
                }).indexOf(rule)];
                _this.jobValidatedBy = selectedValidRule.validatedBy;
                _this.jobValidatedAt = selectedValidRule.validatedAt;
            }
        }
        //Function rules that are validated for job
        function isRuleValidated(rule, validRuleList) {
            var isExist = dataValidationFactory.isRuleValidated(rule, validRuleList);
            if (isExist) {
                var customerInfoValidateRules = ['POTENTIAL', 'GOA'];
                var paymentValidation = ['TOO_HIGH_CUSTOMER_PRICE', 'MISC_COST', 'INCORRECT_PROVIDER_EXTRA_COST', 'TOO_HIGH_PROVIDER_COST'];
                _this.isValidCheckBox = true;
                if (customerInfoValidateRules.indexOf(rule) !== -1) {
                    for (var i in _this.showValidatedCheckbox) {
                        if (customerInfoValidateRules.indexOf(i) !== -1) {
                            _this.isJobSectionValid = true;
                            _this.isJobSectionInValid = false;
                            _this.isValidCheckBox = true;
                            if (!_this.showValidatedCheckbox[i].value) {
                                _this.isJobSectionValid = false;
                                _this.isJobSectionInValid = true;
                                break;
                            }
                        }
                    }
                    // _this.jobValidatedData = {'name':}
                    return isExist;
                }
                if (paymentValidation.indexOf(rule) !== -1) {
                    for (var i in _this.showValidatedCheckbox) {
                        if (paymentValidation.indexOf(i) !== -1) {
                            _this.isPaymentSectionValid = true;
                            _this.isPaymentSectionInValid = false;
                            _this.isValidCheckBox = true;
                            if (!_this.showValidatedCheckbox[i].value) {
                                _this.isPaymentSectionValid = false;
                                _this.isPaymentSectionInValid = true;
                                break;
                            }
                        }
                    }
                    return isExist;
                }
            } else {
                return isExist;
            }

        }
        //unvalidate rule for job
        function unvalidateJobRule(rule) {
            if (_this.showValidatedCheckbox[rule].value) {
                var jobArray = [];
                var paymentArray = [];
                for (var i = 0, y = 0, z = 0; i < _this.validatedRules.length; i++) {
                    if (_this.validatedRules[i].type === 'POTENTIAL' || _this.validatedRules[i].type === 'GOA') {
                        jobArray[y] = _this.validatedRules[i].type;
                        y++;
                    } else
                    {
                        paymentArray[z] = _this.validatedRules[i].type;
                        z++;
                    }
                }
                var selectedInvalidRule = _this.validatedRules[_this.validatedRules.map(function (invalidRule) {
                    return invalidRule.type;
                }).indexOf(rule)];

                dataValidationFactory.unValidateJob(selectedInvalidRule.id).then(function (response) {
                    _this.showValidatedCheckbox[rule].value = false;
                    _this.isValidCheckBox = false;
                    _this.isValidated = false;
                    _this.validationHeader = 'VALIDATE';
                    _this.validatedTimeStamp = new Date();
                    if (paymentArray.length) {
                        var count = 0;
                        for (var i = 0; i < paymentArray.length; i++) {
                            if (!_this.showValidatedCheckbox[paymentArray[i]].value) {
                                count++;
                                _this.isPaymentSectionValid = false;
                                _this.isPaymentSectionInValid = true;
                            }
                        }
                    }
                    if (jobArray.length) {
                        var count = 0;
                        for (var i = 0; i < jobArray.length; i++) {
                            if (!_this.showValidatedCheckbox[jobArray[i]].value) {
                                count++;
                                _this.isJobSectionValid = false;
                                _this.isJobSectionInValid = true;
                            }
                        }
                    }
                    _this.unValidatedRules.push(selectedInvalidRule);
                }, function () {

                });
            } else {
                closeCheckValidation(rule);
            }

        }

        /**
         * Open Updated towing distance modal
         */
        function openTowingDistanceUpdateModal() {
            modalInstanceUpdateTowingDistance = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/job/jobdetail/updateTowingDistance.template.html',
                windowClass: 'fade modalEditTeamMember InputCretCardPopup CancelJobPopup mainModalPadding alertUpdateTimingPopUp'
            });
        }

        // Close towing distance update
        function cancelUpdateTowingDistanceModal() {
            modalInstanceUpdateTowingDistance.dismiss('cancel');
        }

        /**
         * Update Towing distance
         * @param jobNumber
         * @param value
         */
        function updateTowingDistance(jobNumber, value) {
            if (value && value !== undefined) {
                notification.showLoading();
                jobDetailFactory.updateTowingDistance(jobNumber, value).then(function (response) {
                    _this.activeJobDetail.service.estimatedTowMiles = parseFloat(value);
                    cancelUpdateTowingDistanceModal();
                    _this.updatedEstimatedTowMiles = "";
                    notification.hideLoading();
                }, function (response) {
                    notification.hideLoading();
                    exceptionFactory.catchException("Error in updateTowingDistance(jobdetail.controlle.js)" + JSON.stringify(response));
                });
            }
        }

        /**
         * Open Vehicle Detail Update modal
         */
        function openVehicleDetailUpdateModel() {
            _this.registrationNumber = _this.activeJobDetail.vehicle.licensePlate;
            _this.vin = _this.activeJobDetail.vehicle.vin;
            modalInstanceUpdateVehicle = $uibModal.open({
                scope: $scope,
                backdrop: 'static',
                animation: true,
                templateUrl: 'scripts/modules/home/content/job/jobdetail/vehicleDetailUpdate.template.html',
                windowClass: 'fade modalEditTeamMember InputCretCardPopup CancelJobPopup mainModalPadding alertUpdateTimingPopUp'
            });
        }

        /**
         * Update vehicle detail
         */
        function updateVehicleDetail() {
            var jobNumber = _this.activeJobDetail.service.number;
            if (_this.registrationNumber != "" && _this.vin != "") {
                var data = {
                    'licensePlate': _this.registrationNumber,
                    'vin': _this.vin
                };
                notification.showLoading();
                jobDetailFactory.updateVehicleDetail(jobNumber, data).then(function (response) {
                    _this.activeJobDetail.vehicle.licensePlate = _this.registrationNumber;
                    _this.activeJobDetail.vehicle.vin = _this.vin;
                    cancelVehicleDetailUpdateModal();
                    _this.registrationNumber = "";
                    _this.vin = "";
                    notification.hideLoading();
                }, function (response) {
                    notification.hideLoading();
                    exceptionFactory.catchException("Error in updateVehicleDetail(jobdetail.controlle.js)" + JSON.stringify(response));
                });
            }

        }

        // Close vehicle detail update modal
        function cancelVehicleDetailUpdateModal() {
            modalInstanceUpdateVehicle.dismiss('cancel');
        }

        //validate registration number
        function validateRegNumber(event) {
            if ((!((event.charCode < 48 || event.charCode > 57) && (event.charCode < 65 || event.charCode > 90) && (event.charCode < 97 || event.charCode > 123) && event.charCode !== 32)) || (event.keyCode === 8) || (event.keyCode === 32)) {
                return;
            } else {
                event.preventDefault();
            }
        }

        //validate registration number
        function validateVINNumber(event) {
            if ((!((event.charCode < 48 || event.charCode > 57) && (event.charCode < 65 || event.charCode > 90) && (event.charCode < 97 || event.charCode > 123) && event.charCode !== 32)) || (event.keyCode === 8) || (event.keyCode === 32)) {
                return;
            } else {
                event.preventDefault();
            }
        }

        //get smart location
        function getSmartLocation() {
            jobDetailFactory.getSmartLocation(_this.activeJobDetail.provider.phoneNumber).then(function (response) {
                loggingFactory.log("response")
            })
        }

        function onUpdateAssignedCSR(event, data) {
            if (data.service && data.service.managedBy) {
                if (_this.activeJobDetail.service.number == data.service.number) {
                    if(_this.assignedCsr) {
                      _this.assignedCsr.name = data.service.managedBy;
                    } else {
                      _this.assignedCsr = {"name":data.service.managedBy};
                    }
                }
            }
        }

        //isRuleValidated('POTENTIAL',_this.validatedRules);
        //getServices();
        _this.services = shareableContent.getServices();
        if (_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.number) {
            if (userData.authority !== 'ROLE_DISPATCH') {
                getDriverDetails(_this.activeJobDetail.service.number);
            }
        }
        //getCancelList();
        var cancelReasonsList = shareableContent.getCancelReasons();
        if (cancelReasonsList && cancelReasonsList.length > 0) {
            _this.cancelReasons = cancelReasonsList;
        } else {
            getCancelList();
        }

        setDriverStatusOptions();
       if(_this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.number) {
         if(userData.authority !== 'ROLE_DISPATCH'){
             getDispatchEvent(_this.activeJobDetail.service.number);
         }
       }
       function onRemoveAlertForJob(event,data){
           loggingFactory.log("onRemoveAlertForJob ",data)
           _this.dispatchJobAlerts.splice(data,1);
       }

       function onLoadDispatchAlerts(event, data) {
         if(data && _this.activeJobDetail.service.number === data.service.number) {
           if(userData.role === 'Dispatch' && _this.activeJobDetail.service && _this.activeJobDetail.service.id){
             notification.showLoading();
             dispatchJobListFactory.getAlertsForJob(_this.activeJobDetail.service.id, userData.authority).then(function(response){
               if(response.data.length > 0){
                 _this.dispatchJobAlerts = response.data;
               }else{
                 _this.dispatchJobAlerts = [];
               }
               if(response){
                 notification.hideLoading();
               }
             });
           }
         }
       }

      /**
       * Load Alert on job detail call
       */
      function initLoadDispatchAlerts() {
          if(userData.role === 'Dispatch' && _this.activeJobDetail && _this.activeJobDetail.service && _this.activeJobDetail.service.id){
            notification.showLoading();
            dispatchJobListFactory.getAlertsForJob(_this.activeJobDetail.service.id, userData.authority).then(function(response){
              if(response.data.length > 0){
                _this.dispatchJobAlerts = response.data;
              }
              if(response){
                notification.hideLoading();
              }
            });
          }
      }
      /**
      * Get Payment info of Job
       */
      function loadProviderPayments(){
            var amountPaid = 0, amountDue = 0;
            if (_this.jobId && _this.dispatchPhone) {
                //  notification.showLoading();
                providerCostFactory.getProviderAmounts(_this.jobId,userData.dispatchPhoneNumber).then(function (response) {
                    _this.activeJobDetail.allProviderPayment = response;
                    if (response && response.amountsDue) {
                        var providerPaidDue = response.amountsDue;
                        if (providerPaidDue && providerPaidDue.length > 0) {
                            for (var i = 0; i < providerPaidDue.length; i++) {
                                amountDue = parseFloat(amountDue) + parseFloat(providerPaidDue[i].price);
                            }
                        }
                    }
                    _this.totalAmountDue = amountDue.toFixed(2);

                    if (response && response.amountsPaid) {
                        var providerPaidAmount = response.amountsPaid;
                        if (providerPaidAmount && providerPaidAmount.length > 0) {
                            for (var i = 0; i < providerPaidAmount.length; i++) {
                                amountPaid = parseFloat(amountPaid) + parseFloat(providerPaidAmount[i].price);
                            }
                        }
                    }
                    _this.totalAmountPaid = amountPaid.toFixed(2);
                    _this.providerCost = parseFloat(_this.totalAmountDue) + parseFloat(_this.totalAmountPaid);
                    _this.providerPayment = parseFloat(_this.providerCost);
                    _this.serviceProviderCost.price = parseFloat(_this.providerCost);


                }, function () {
                });
            } else {
                _this.totalAmountDue = amountDue.toFixed(2);
                _this.totalAmountPaid = amountPaid.toFixed(2);
            }
      }
          // Modal Close
          function onModalClose(){
            $scope.$emit('onJobDetailClose');
            _this.mapObj.cordinates = [];
            _this.currentIndex = 0;
            _this.mapObj.isUpdating = true;
            clearInterval(_this.mapObj.mapClearInterval);
            _this.mapObj.resetMapConfig();
          }
          // Success Of World Pay Payment
          function onSuccessWorldPayPayment(){
            onPaymentValidate(null, _this.activeJobDetail);
            if (modalInstanceWorldPayment) {
              modalInstanceWorldPayment.dismiss('cancel');
            }
            if (modalInstanceCustomerPrice) {
              modalInstanceCustomerPrice.dismiss('cancel');
            }
          }
          // Payment error
          function onPaymentError(){
            _this.isEditPaymentError = true;
          }



        // All the watch for this controller
        $scope.$watch(function () {
          return _this.mapObj.estimatedTime;
        }, function (newVal, oldVal) {
          if (_this.activeJobDetail && _this.activeJobDetail.provider && _this.activeJobDetail.provider.status == '1101') {
            _this.activeJobDetail.eta = newVal;
          }
        });

        $scope.$watch(function () {
          return _this.mapObj.estimatedDistance;
        }, function (newVal, oldVal) {
          if (_this.activeJobDetail && _this.activeJobDetail.provider && _this.activeJobDetail.provider.status == '1101') {
            _this.activeJobDetail.distance = newVal;
          }

        });

        $scope.$watch(function () {
          return _this.isChatOpen;
        }, function (newVal, oldVal) {
          $scope.$emit('onToggleChatWindow', newVal);
          if (newVal) {
            _this.chatSummaryUnread = [];
          }
        });


    function setManualValidationRuleMapping(){
      _this.manualRuleMapping = [];
      _this.manualRuleMapping['DAMAGE_CLAIM'] = config.DAMAGE_CLAIM;
      _this.manualRuleMapping['VERIFYING_JOB_EVENTS'] = config.VERIFYING_JOB_EVENTS;
      _this.manualRuleMapping['VERIFYING_JOB_PRICE'] = config.VERIFYING_JOB_PRICE;
    }


    function onProviderUpdatePubnub(){
      _this.jobReassignPubnub = true;
    }

        $rootScope.$on('providerLocationUpdate', onProviderLocationUpdate);
        $scope.$on('jobUpdatePubnub', onJobPubnub);
        $scope.$on('chatMessage', onChatMessageRecieved);
        $scope.$on('modal.closing', onModalClose);
        $scope.$on('eventScrollEnd', onScrollEnd);
        $scope.$on('alertEventScrollEnd', onAlertScrollEnd);
        $rootScope.$on('changeStartToComplete', startToComplete);
        $scope.$on('startToComplete', startToComplete);
        $scope.$on('closeOpenedJobDetail', cancel);
        $scope.$on('onSuccessWorldPayment', onSuccessWorldPayPayment);
        $scope.$on('cancelPaymentPopup', cancelWorldPayPopUp);
        $scope.$on('paymentError', onPaymentError);
        $scope.$on('paymentValidate', onPaymentValidate);
        $scope.$on('getAddressFromPhone', onGetAddressFromPhone);
        $scope.$on('updateAssignedCSR', onUpdateAssignedCSR);
        $scope.$on('removeAlertForJob',onRemoveAlertForJob);
        $scope.$on('loadDispatchAlerts',onLoadDispatchAlerts);



       // All the function declaration for this controller
        _this.cancel = cancel;
        _this.cancelJob = cancelJob;
        _this.validatePayment = validatePayment;
        _this.validateCreditCard = validateCreditCard;
        _this.editPayment = editPayment;
        _this.savePayment = savePayment;
        _this.openChangeVehicleLoc = openChangeVehicleLoc;
        _this.openChangeDropOffLoc = openChangeDropOffLoc;
        _this.cancelVehicleLocPopup = cancelVehicleLocPopup;
        _this.saveVehicleLocPopup = saveVehicleLocPopup;
        _this.saveDropOffLocPopup = saveDropOffLocPopup;
        _this.toggleCancelTooltip = toggleCancelTooltip;
        _this.setAssignCSR = setAssignCSR;
        _this.setMonth = setMonth;
        _this.setYear = setYear;
        _this.minimizeJob = minimizeJob;
        _this.sendChatMessage = sendChatMessage;
        _this.cancelReasonNotePopup = cancelReasonNotePopup;
        _this.saveReasonNotePopup = saveReasonNotePopup;
        _this.acknowledge = acknowledge;
        _this.closeAlert = closeAlert;
        _this.snooze = snooze;
        _this.sendTextToCustomer = sendTextToCustomer,
        _this.sendTextToDriver = sendTextToDriver,
        _this.sendNotes = sendNotes,
        _this.inviteProvider = inviteProvider,
        _this.checkOutProvider = checkOutProvider,
        _this.changeService = changeService,
        _this.getServices = getServices,
        _this.jobEventsLog = jobEventsLog,
        _this.openJobEventLogModal = openJobEventLogModal,
        _this.cancelJobEventLog = cancelJobEventLog,
        _this.getElapseTime = getElapseTime,
        _this.DMYHMS = DMYHMS,
        _this.getEventsLog = getEventsLog,
        _this.getCustomerMessages = getCustomerMessages,
        _this.getDriverMessages = getDriverMessages,
        _this.openEmailReceipt = openEmailReceipt,
        _this.cancelEmailReceipt = cancelEmailReceipt,
        _this.sendEmailReceipt = sendEmailReceipt,
        _this.providerAction = providerAction,
        _this.openChangeStatus = openChangeStatus,
        _this.cancelChangeStatusPopUp = cancelChangeStatusPopUp,
        _this.sendChangeStatus = sendChangeStatus,
        _this.changeJobStatus = changeJobStatus,
        _this.providerStatus = providerStatus,
        _this.setJobStatus = setJobStatus,
        _this.getDriverDetails = getDriverDetails,
        _this.openCancelReasons = openCancelReasons,
        _this.getCancelReasons = getCancelReasons,
        _this.cancelReasonPopUp = cancelReasonPopUp,
        _this.selectedReason = selectedReason,
        _this.sendCancelReason = sendCancelReason,
        _this.getDriverMessages = getDriverMessages,
        _this.getNotes = getNotes,
        _this.getPotentials = getPotentials,
        _this.returnStatusId = returnStatusId,
        _this.getCancelList = getCancelList,
        _this.cardPayment = cardPayment,
        _this.cashPayment = cashPayment,
        _this.thirdPartyPayment = thirdPartyPayment,
        _this.openCustomSnoozeModal = openCustomSnoozeModal,
        _this.cancelCustomSnooze = cancelCustomSnooze,
        _this.showDatePicker = showDatePicker,
        _this.openMsgNotesChatModal = openMsgNotesChatModal,
        _this.cancelMsgNotesChatModal = cancelMsgNotesChatModal,
        _this.setSelectedTab = setSelectedTab,
        _this.setDriverStatusOptions = setDriverStatusOptions,
        _this.setDriverStatus = setDriverStatus,
        _this.alertBtn = alertBtn,
        _this.openCancelPopup = openCancelPopup;
        _this.closeCancelJobPopup = closeCancelJobPopup;
        _this.cancelReasonChange = cancelReasonChange;
        _this.openUpdateTiming = openUpdateTiming;
        _this.cancelUpdateTimingModal = cancelUpdateTimingModal;
        _this.setDispatchEvent = setDispatchEvent;
        _this.setPaymentType = setPaymentType;
        _this.getDispatchEvent = getDispatchEvent;
        _this.postDispatchEvent = postDispatchEvent;
        _this.escalateJob = escalateJob;
        _this.setMapToLocation = setMapToLocation;
        _this.openFindProviderPopup = openFindProviderPopup;
        _this.cancelConfirmationModal = cancelConfirmationModal;
        _this.openConfirmationModal = openConfirmationModal;
        _this.showConfirmationModal = showConfirmationModal;
        _this.takeAction = takeAction;
        _this.openCustomerPaymentModal = openCustomerPaymentModal;
        _this.cancelChangeStatusPopUp = cancelChangeStatusPopUp;
        _this.setSelectedPaymentType = setSelectedPaymentType;
        _this.setEventLogTab = setEventLogTab;
        _this.cloneCurrentJob = cloneCurrentJob;
        _this.openOtherProviderPaymentModal = openOtherProviderPaymentModal;
        _this.cancelProviderPaymentPopUp = cancelProviderPaymentPopUp;
        _this.alertEventsLog = alertEventsLog;
        _this.getCannedMessages = getCannedMessages;
        _this.putCannedMessages = putCannedMessages;
        _this.setSelectedCannedMessage = setSelectedCannedMessage;
        _this.addUpdateOtherProviderPayment = addUpdateOtherProviderPayment;
        _this.updateProviderPayment = updateProviderPayment;
        _this.removeOtherProviderPayment = removeOtherProviderPayment;
        _this.updateOtherProviderPayment = updateOtherProviderPayment;
        _this.getAlertLogPages = getAlertLogPages;
        _this.setAlertStatus = setAlertStatus;
        _this.isPermittedFeature = utilityFactory.isPermittedFeature;
        _this.openDispatchModal = openDispatchModal;
        _this.cancelJobChangeStatusPopUp = cancelJobChangeStatusPopUp;
        _this.setChangeJobStatus = setChangeJobStatus;
        _this.calculateScrollHeight = calculateScrollHeight;
        _this.providerPaymentTypes = providerPaymentTypes;
        _this.getLocation = getLocation;
        _this.openProviderPaymentModal = openProviderPaymentModal;
        _this.cancelOtherProviderPaymentPopUp = cancelOtherProviderPaymentPopUp;
        _this.getUnvalidateRulesOfJob = getUnvalidateRulesOfJob;
        _this.jobLevelValidation = jobLevelValidation;
        _this.closeCheckValidation = closeCheckValidation;
        _this.showToolTip = showToolTip;
        _this.hideToolTip = hideToolTip;
        _this.isRuleApplied = isRuleApplied;
        _this.isRuleValidated = isRuleValidated;
        _this.unvalidateJobRule = unvalidateJobRule;
        _this.getValidByNTime = getValidByNTime;
        _this.getSmartLocation = getSmartLocation;
        _this.dismissCustomerPricePopup = dismissCustomerPricePopup;
        _this.dismissWorldPayPopup = dismissWorldPayPopup;
        _this.openRefundPopUp = openRefundPopUp;
        _this.getRefundStatus = getRefundStatus;
        _this.unsubscribeGetLocationChannel = unsubscribeGetLocationChannel;
        _this.getSmartLocation = getSmartLocation;
        _this.returnOtherProviderCostLable = returnOtherProviderCostLable;
        _this.isValidOtherProviderPaymentForm = isValidOtherProviderPaymentForm;
        _this.getValidatedRulesOfJob = getValidatedRulesOfJob;
        _this.setOtherProviderPayment = setOtherProviderPayment;
        _this.beginProviderAnimation = beginProviderAnimation;
        _this.voidTransaction = voidTransaction;
        _this.jobLog = jobLog;
        _this.getAllLogPages = getAllLogPages;
        _this.openTowingDistanceUpdateModal = openTowingDistanceUpdateModal;
        _this.cancelUpdateTowingDistanceModal = cancelUpdateTowingDistanceModal;
        _this.updateTowingDistance = updateTowingDistance;
        _this.updateVehicleDetail = updateVehicleDetail;
        _this.cancelVehicleDetailUpdateModal = cancelVehicleDetailUpdateModal;
        _this.openVehicleDetailUpdateModel = openVehicleDetailUpdateModel;
        _this.validateRegNumber = validateRegNumber;
        _this.validateVINNumber = validateVINNumber;
        //_this.destroyAnimationVars = destroyAnimationVars;
        //_this.loadProviderPayments = loadProviderPayments;
        _this.isFeatureAllowed = featureFactory.isFeatureAllowed;
    }
    jobDetailController.$inject = [
        'jobDetail.factory',
        '$scope',
        '$uibModal',
        '$uibModalInstance',
        'app.core.exceptionFactory',
        'config',
        'notification.factory',
        'utility.factory',
        'app.core.loggingFactory',
        'mapServices',
        'activeJobDetail',
        '$rootScope',
        'appString',
        '$compile',
        //'getAssignedCsr',
        'getPaymentInstrument',
        //'getPeerList',
        'minimizeJobs',
        'pubnub.factory',
        'user.factory',
        'activeJobListDetail',
        'snoozedListDetail',
        'jobDetailList',
        'appGlobals',
//    'utility.factory',
        'shareableContent.factory',
        'jobStatus.factory',
        'getDisablementReason',
        'isAlertDetail',
        'addJob.factory',
        'partnerConfig',
        '$timeout',
        '$uibModalStack',
        '$interval',
        'refund.factory',
        'dataValidation.factory',
        'feature.factory',
        'dispatchUtility.factory',
        //'currentJobIndex',
        'dispatchJobList.factory',
        'providerCost.factory'
    ];

    angular.module('app.home.content.jobDetail', [
        'app.core',
        'app.common',
        'jobDetail.findProvider',
        'jobDetail.refund'
    ]).controller('jobDetail.controller', jobDetailController);

})();

