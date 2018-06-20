'use strict';
var angularObj = {
    app: null,
    initAngular: function (api, freshState) {
        angularObj.app = angular.module('myAplicacion', ['ngMaterial', 'material.components.expansionPanels', 'md.data.table']);
        angularObj.app.controller('accesoDatosController', ['$scope', '$filter', '$http','$mdSelect', '$window', function ($scope, $filter, $http, $mdSelect,$window) {
            $scope.lstDeviceGeotab = [];
            $scope.dispositivoSeleccionado = [];
            $scope.lstDevice = {};            
            $scope.resultReporteFechas = [];
            $scope.resultConsultaVehiculos = [];
            $scope.resultConsultaVehiculosFiltro = [];
            $scope.Data = {
                start: new Date(),
                end: new Date()
            };
            $scope.eventos = [];
            var vehiculos = {};
            
             $window.addEventListener('dblclick', function (e) {
                $mdSelect.hide();
            });
            $scope.selected = [];
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
            /*Autenticacion Pepsi $http({
                method: 'GET',
                url: 'https://cppa.metricamovil.com/GeneradordeReportes/Getautenticacion'
            }).then(function successCallback(response) {
                console.log(response);
                $scope.lstDeviceGeotab = response.data;
                $scope.lstDeviceGeotab.forEach(function (device) {
                    $scope.lstDevice.id = device;
                })
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(response);
            });*/
            api.call("Get", {
                "typeName": "Device"
            }, function (result) {
                $scope.lstDeviceGeotab = result;
                $scope.lstDeviceGeotab.forEach(function (device) {
                   vehiculos[device.id] = device;
                    $scope.$apply(function () {
                        $scope.lstDevice.id = device.id;
                    })
                })
            }, function (e) {
                console.error("Failed:", e.message);
            });

            // funcion que permite ingresar texto en el search 
            $scope.updateSearch = function updateSearch(e) {
                e.stopPropagation();
            };

            $scope.getDevice = function (device) {
                try {
                    $scope.dispositivoSeleccionado = device;
                    $scope.$apply();

                } catch (error) {
                    console.log(error.message);
                }
            }
            
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
             $scope.consultaDatos = function (deviceId) {
                try {
                    var calls = $scope.getCalls(deviceId);

                    //api call
                    api.multiCall(calls, function (results) {
                        console.log(results);

                        var totalEventos = {};

                        var btnPanico = results[0].filter(function (panico) {
                            return panico.data === 1
                        }).length;
                        totalEventos.btnPanico = btnPanico;
                        var btnCinturon = results[1].filter(function (cinturon) {
                            return cinturon.data === 1
                        }).length;
                        totalEventos.btncinturon = btnCinturon;
                        var btnReversa = results[2].filter(function (reversa) {
                            return reversa.data === 1
                        }).length;
                        totalEventos.btnReversa = btnReversa;
                        var btnCirculo5 = results[3].filter(function (circulo5) {
                            return circulo5.data === 1
                        }).length;
                        totalEventos.btnCirculo5 = btnCirculo5;
                        var btnCirculo6 = results[4].filter(function (circulo6) {
                            return circulo6.data === 1
                        }).length;
                        totalEventos.btncirculo6 = btnCirculo6;
                        var btnCirculo7 = results[5].filter(function (circulo7) {
                            return circulo7.data === 1
                        }).length;
                        totalEventos.btncirculo7 = btnCirculo7;
                        var btnCirculo8 = results[6].filter(function (circulo8) {
                            return circulo8.data === 1
                        }).length;
                        totalEventos.btncirculo8 = btnCirculo8;
                        totalEventos.comunicacion = results[7][0].dateTime;

                        totalEventos.ids = deviceId;
                        totalEventos.serialNumber = vehiculos[deviceId].serialNumber;
                        totalEventos.vehicleIdentificationNumber = vehiculos[deviceId].vehicleIdentificationNumber;
                        totalEventos.name = vehiculos[deviceId].name;
                        $scope.eventos.push(totalEventos);
                        $scope.$apply();
                    }, function (e) {
                        console.log(e.message);
                    });
                } catch (error) {
                    console.log(error.message);
                }
            }
            
            $scope.consultaVehiculos = function () {
                try {
                    $scope.dispositivoSeleccionadoAux = this.dispositivoSeleccionado;
                    if ($scope.dispositivoSeleccionadoAux.length === 0) {
                        swal({
                            type: 'error',
                            text: 'Debes seleccionar un vehículo para continuar la consulta.'
                        });
                    }

                    if ($scope.dispositivoSeleccionadoAux.length > 0) {
                        $scope.dispositivoSeleccionadoAux.forEach(function (dispositivo) {
                            $scope.consultaDatos(dispositivo.id);
                            swal({
                                imageUrl: 'https://rawgit.com/MayraDelgado/GeneradorReportes/master/app/img/cargando5.gif',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        });
                    }

                } catch (error) {
                    console.log(error.message);
                }              
            }
             /*$scope.vehiculosreport = function () {
                var dispositivoSeleccionadoAux = this.dispositivoSeleccionado;
                  if (dispositivoSeleccionadoAux.length === 0) {
                    swal({
                        type: 'error',
                        text: 'Debes seleccionar al menos un vehículo para continuar la consulta !!',
                    })
                } else
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
            }*/
             $scope.crearCSVFechas = function () {
               if ($scope.resultReporteFechas.length === 0) {
                    swal(
                        '',
                        'No hay datos que descargar',
                        "error"
                    )
                    console.log(" ¯\_(ツ)_/¯ No hay datos que descargar");
                } else
                if ($scope.resultReporteFechas.length > 0) {
                    $("#fechaInstalacion").table2excel({
                        filename: "AuditoríadeRegistros_Fechas"
                    });
                }
            }
             
            $scope.crearCSVvehiculo = function () {
                if ($scope.eventos.length === 0) {
                    swal(
                        '',
                        'No hay datos que descargar',
                        "error",
                    )
                    //console.log("No hay datos que descargar");
                } else
                if ($scope.eventos.length > 0) {
                    $("#fechaDevice").table2excel({
                        filename: "AuditoríadeRegistros"
                    });
                }
            }
            $scope.getCalls = function (deviceId) {
                try {
                    var ids = [
                        "diagnosticAux1Id",
                        "diagnosticAux2Id",
                        "diagnosticAux3Id",
                        "diagnosticAux5Id",
                        "diagnosticAux6Id",
                        "diagnosticAux7Id",
                        "diagnosticAux8Id",
                    ];
                    var calls = [];

                    ids.forEach(function (id) {
                        calls.push(
                            ["Get", {
                                "typeName": "StatusData",
                                "search": {
                                    "deviceSearch": {
                                        "id": deviceId
                                    },
                                    "diagnosticSearch": {
                                        "id": id
                                    },
                                    "fromDate": moment($scope.Data.start).format('YYYY-MM-DD') + " 05:00:00",
                                    "toDate": moment($scope.Data.end).add(1, 'd').format('YYYY-MM-DD') + " 05:00:00"
                                }
                            }]);
                    });
                    calls.push(
                       ["Get", {
                            "typeName": "DeviceStatusInfo",
                            "search": {
                                "deviceSearch": {
                                    "id": deviceId
                                }
                            }
                        }]
                    )
                    return calls;
                } catch (error) {
                    console.log(error.message);
                    return error;
                }
            }

        }]);

        angularObj.app.config(function ($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function (date) {
                return moment(date).format('MM-DD-YYYY');
            }
        });


    }
}
