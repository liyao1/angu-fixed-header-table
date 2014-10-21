﻿/**
 * AngularJS fixed header scrollable table directive
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.0.0
 */
(function () {
    angular.module('anguFixedHeaderTable', [])
    .directive('fixedHeader', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                tableHeight: '@'
            },
            link: function ($scope, $elem, $attrs, $ctrl) {
                function isVisible(el) {
                    var style = window.getComputedStyle(el);
                    return (style.display != 'none' && el.offsetWidth !=0 );
                }
                var elem = $elem[0];
                // wait for content to load into table
                $scope.$watch(function () { return isVisible(elem.querySelector("tbody")); },
                    function (newValue, oldValue) {
                        if (newValue === true) {
                            // reset display styles so column widths are correct when measured below
                            angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '')

                            // wrap in $timeout to give table a chance to finish rendering
                            $timeout(function () {
                                // set widths of columns
                                angular.forEach(elem.querySelectorAll('th'), function (thElem, i) {

                                    var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                                    var tfElems = elem.querySelector('tfoot tr:first-child td:nth-child(' + (i + 1) + ')');

                                    var columnWidth = tdElems.offsetWidth//tdElems.width();
                                    tdElems.style.width = columnWidth + 'px';
                                    if(thElem) {
                                        thElem.style.width = columnWidth + 'px';
                                    }
                                    if (tfElems) {
                                        tfElems.style.width = columnWidth + 'px';
                                    }
                                });

                                // set css styles on thead and tbody
                                angular.element(elem.querySelectorAll('thead, tfoot')).css('display', 'block')

                                angular.element(elem.querySelectorAll('tbody')).css({
                                    'display': 'block',
                                    'height': $scope.tableHeight || '400px',
                                    'overflow': 'auto'
                                });


                                // reduce width of last column by width of scrollbar
                                var scrollBarWidth = elem.querySelector('thead').offsetWidth - elem.querySelector('tbody').clientWidth;
                                if (scrollBarWidth > 0) {
                                    // for some reason trimming the width by 2px lines everything up better
                                    scrollBarWidth -= 2;
                                    angular.forEach(elem.querySelectorAll('tbody tr:first-child td:last-child'), function (el, i) {
                                        el.style.width = (el.offsetWidth - scrollBarWidth) + 'px';
                                    });
                                }
                            });
                        }
                    });
            }
        };
    }]);
})();