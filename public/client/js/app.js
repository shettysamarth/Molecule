"use strict";
(function() {
    angular
        .module("MoleculeApp", ['ngRoute', 'snap'])
        .config(function(snapRemoteProvider) {
            snapRemoteProvider.globalOptions.disable = 'right';
            // or
            snapRemoteProvider.globalOptions = {
                disable: 'right',
                maxPosition: 100,
                minPosition: 100
                // ... others options
            };
        })
})();