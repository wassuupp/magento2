/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define(
    [
        'underscore',
        'jquery',
        'uiComponent',
        'paypalInContextExpressCheckout',
        'Magento_Customer/js/customer-data',
        'domReady!'
    ],
    function (
        _,
        $,
        Component,
        paypalExpressCheckout,
        customerData
    ) {
        'use strict';

        return Component.extend({

            defaults: {
                clientConfig: {

                    /**
                     * @param {Object} event
                     */
                    click: function (event) {
                        event.preventDefault();

                        paypalExpressCheckout.checkout.initXO();

                        $.get(
                            this.path,
                            {
                                button: 1
                            }
                        ).done(
                            function (response) {
                                if (response && response.token) {
                                    paypalExpressCheckout.checkout.startFlow(response.token);

                                    return;
                                }

                                paypalExpressCheckout.checkout.closeFlow();
                            }
                        ).fail(
                            function () {
                                paypalExpressCheckout.checkout.closeFlow();
                            }
                        ).always(
                            function () {
                                $('body').trigger('processStop');
                                customerData.invalidate(['cart']);
                            }
                        );
                    }
                }
            },

            /**
             * @returns {Object}
             */
            initialize: function () {
                this._super();

                return this.initClient();
            },

            /**
             * @returns {Object}
             */
            initClient: function () {
                _.each(this.clientConfig, function (fn, name) {
                    if (typeof fn === 'function') {
                        this.clientConfig[name] = fn.bind(this);
                    }
                }, this);

                paypalExpressCheckout.checkout.setup(this.merchantId, this.clientConfig);

                return this;
            }
        });
    }
);
