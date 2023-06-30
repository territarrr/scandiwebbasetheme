define([
    'jquery',
    'Magento_Customer/js/model/authentication-popup',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'Magento_Ui/js/modal/confirm',
    'underscore',
    'jquery-ui-modules/widget',
    'mage/decorate',
    'mage/collapsible',
    'mage/cookies',
    'jquery-ui-modules/effect-fade'
], function ($, authenticationPopup, customerData, _) {
    'use strict';

    return function (targetWidget) {
        $.widget('mage.sidebar', targetWidget, {
            _initContent: function () {
                var self = this,
                    events = {};

                this.element.decorate('list', this.options.isRecursive);

                events['click ' + this.options.button.close] = function (event) {
                    event.stopPropagation();
                    $(self.options.targetElement).dropdownDialog('close');
                };

                events['click ' + this.options.button.checkout] = $.proxy(function () {
                    var cart = customerData.get('cart'),
                        customer = customerData.get('customer'),
                        element = $(this.options.button.checkout);

                    if (!customer().firstname && cart().isGuestCheckoutAllowed === false) {
                        $.cookie('login_redirect', this.options.url.checkout);

                        if (this.options.url.isRedirectRequired) {
                            element.prop('disabled', true);
                            location.href = this.options.url.loginUrl;
                        } else {
                            authenticationPopup.showModal();
                        }

                        return false;
                    }
                    element.prop('disabled', true);
                    location.href = this.options.url.checkout;
                }, this);

                events['click ' + this.options.button.remove] = function (event) {
                    self._removeItem($(event.currentTarget));
                };

                events['keyup ' + this.options.item.qty] = function (event) {
                    self._showItemButton($(event.target));
                };

                events['change ' + this.options.item.qty] = function (event) {
                    self._showItemButton($(event.target));
                };

                events['click ' + this.options.item.button] = function (event) {
                    event.stopPropagation();
                    self._updateItemQty($(event.currentTarget));
                };

                events['focusout ' + this.options.item.qty] = function (event) {
                    self._validateQty($(event.currentTarget));
                };

                this._on(this.element, events);
                this._calcHeight()
            }
        });

        return $.mage.sidebar;
    };
});
