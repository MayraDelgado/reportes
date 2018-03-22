'use strict';
var angularObj = {
    app: null,
    initAngular: function (api, freshState) {
        angularObj.app = angular.module('myAplicacion', ['ngMaterial', 'material.components.expansionPanels', 'md.data.table']).config([
            '$provide',
            function ($provide) {

            }
        ]);

        angularObj.app.controller('accesoDatosController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {
            $scope.lstDeviceGeotab = [];
            $scope.dispositivoSeleccionado = [];
            $scope.lstDevice = {};
            $scope.resultConsultaVehiculos = [];
            $scope.resultConsultaVehiculosFiltro = [];
            $scope.Data = {
                start: new Date(),
                end: new Date()

            };
            $scope.currentPage = 0;
            $scope.pageSize = 10;
            $scope.data = [];
            $scope.q = '';

            $scope.getData = function () {
                return $filter('filter')($scope.data, $scope.q)
            }
            $scope.numberOfPages = function () {
                return Math.ceil($scope.getData().length / $scope.pageSize);
            }
            // api call vehiculos geotab
            api.call("Get", {
                typeName: "Device"
            }, function (result) {
                $scope.lstDeviceGeotab = result;
                $scope.lstDeviceGeotab.forEach(function (device) {
                    $scope.lstDevice.id = device;
                    //console.log(device);
                }); //console.log(device);
            }, function (error) {
                console.log(error.message);
            });

            // funcion que permite ingresar texto en el search 
            $scope.updateSearch = function updateSearch(e) {
                e.stopPropagation();
            };

            $scope.getDevice = function (device) {
                try {
                    //$scope.dispositivoSeleccionado = device;
                    $scope.$apply();

                } catch (error) {
                    console.log(error.message);
                }
            }
           /* $scope.consultaReporteFechas = function () {
                //console.log("muestra mensaje timer");
                try {
                    swal({
                        imageUrl: 'https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando.gif',
                        timer: 5000,
                        showConfirmButton: false
                    }).then(function (result) {
                        console.log({
                            start: moment($scope.Data.start).format('MM-DD-YYYY'),
                            end: moment($scope.Data.end).format('MM-DD-YYYY')
                        });
                        //return;
                        var conAjax = $http.post("https://cppa.metricamovil.com/PMFReports/DateReport", {
                            start: moment($scope.Data.start).format('MM-DD-YYYY'),
                            end: moment($scope.Data.end).format('MM-DD-YYYY')
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function successCallback(response) {
                            console.log(response);
                            $scope.resultReporteFechas = response.data;
                        }, function errorCallback(response) {
                            console.error(response);
                        });
                    });


                } catch (error) {
                    console.log(error.message);
                }
            }*/
            
            $scope.fechasreport = function () {
                swal({
                    imageUrl: 'https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando5.gif',
                    timer: 5000,
                    showConfirmButton: false
                }); //id unidades seleccionadas y el correo 
                var conAjax = $http.post("https://cppa.metricamovil.com/PMFReports/DateReport", {
                    start: moment($scope.Data.start).format('MM-DD-YYYY'),
                    end: moment($scope.Data.end).format('MM-DD-YYYY')
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    console.log(response);
                    $scope.resultReporteFechas = response.data;
                    if ($scope.resultReporteFechas.length === 0) {
                        swal({
                            type: 'error',
                            text: 'No existen registros en el rango de fechas seleccionado',
                        });
                    }

                });
            }

            /*$scope.consultaVehiculos = function () {
                try {
                    //$scope.dispositivoSeleccionado = $scope.lstDeviceGeotab;
                    var dispositivoSeleccionadoAux = this.dispositivoSeleccionado;
                    if (dispositivoSeleccionadoAux.length > 0) {
                        swal({
                            imageUrl: "https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando5.gif",
                            timer: 5000,
                            showConfirmButton: false
                        }).then(function (result) {
                            var listaIds = [];
                            dispositivoSeleccionadoAux.forEach(function (dispositivo) {
                                listaIds.push(dispositivo.id);
                            });
                            var conAjax = $http.post("https://cppa.metricamovil.com/PMFReports/DeviceReport", JSON.stringify({
                                start: moment($scope.Data.start).format('MM-DD-YYYY'),
                                end: moment($scope.Data.end).format('MM-DD-YYYY'),
                                devices: listaIds
                            }), {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(function successCallback(response) {
                                $scope.resultConsultaVehiculos = response.data;
                                console.log(response);
                                if ($scope.resultConsultaVehiculos.length === 0) {
                        swal({
                            type: 'error',
                            text: 'No existen registros en el rango de fechas seleccionado',
                        });
                    }
                            }, function errorCallback(respone) {
                                console.error(response);
                            });
                        });
                    }

                } catch (error) {
                    console.log(error.message);
                }
            }*/
             $scope.vehiculosreport = function () {
                var dispositivoSeleccionadoAux = this.dispositivoSeleccionado;
                if (dispositivoSeleccionadoAux.length > 0) {
                    swal({
                        imageUrl: 'https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando5.gif',
                        timer: 5000,
                        showConfirmButton: false,
                    }).then(function (result) {
                        var listaIds = [];
                        dispositivoSeleccionadoAux.forEach(function (dispositivo) {
                            listaIds.push(dispositivo.id);
                        });
                        var conAjax = $http.post("https://cppa.metricamovil.com/PMFReports/DeviceReport", JSON.stringify({
                            start: moment($scope.Data.start).format('MM-DD-YYYY'),
                            end: moment($scope.Data.end).format('MM-DD-YYYY'),
                            devices: listaIds
                        }), {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function successCallback(response) {
                            $scope.resultConsultaVehiculos = response.data;
                            console.log(response);
                            if ($scope.resultConsultaVehiculos.length === 0) {
                                swal({
                                    type: 'error',
                                    //title: 'Oops...',
                                    text: 'No existen registros en el rango de fechas seleccionado',
                                });
                            }
                        }, function errorCallback(response) {
                            console.error(response);
                        });
                    });
                }
            }
             
           /* $scope.crearCSVFechas = function () {
                $('#fechaInstalacion').table2excel({
                    exclude: ".noExl",
                    fileext: ".xls",
                    filename: "AuditoríadeRegistros_Fechas" + new Date().toUTCString().replace(/[\-\:\.]/g, "")
                });
                limpiarTableFechas();
            }*/
           /* $scope.crearCSVvehiculo = function () {
                $("#fechaDevice").table2excel({
                    exclude: ".noExl",
                    fileext: ".xls",
                    filename: "AuditoríadeRegistros_Dispositivos"
                });
                limpiarTableDevices();
            }*/
            var limpiarTableFechas = function () {
                // $('#fechaInstalacion tbody').remove();
                location.reload();

            }
           /* var limpiarTableDevices = function () {
                // $('#fechaDevice tbody').remove();
                location.reload();
            }*/

        }]);

        angularObj.app.config(function ($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function (date) {
                return moment(date).format('MM-DD-YYYY');
            }
        });


    }
}
