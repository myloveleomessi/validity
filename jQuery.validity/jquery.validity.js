/*
 * jQuery.validity v1.0.0
 * http://code.google.com/p/validity/
 * 
 * Copyright (c) 2009 Wyatt Allen
 * Dual licensed under the MIT and GPL licenses.
 *
 * Date: 2009-6-27 (Saturday, 27 June 2009)
 * Revision: 70
 */
(function($) {
    // Default settings.
    var 
        defaults = {
            // The default output mode is label because it requires no dependencies.
            outputMode: "label",

            // The this property is set to true, validity will scroll the browser viewport
            // so that the first error is visible when validation fails.
            scrollTo: false,

            // If this setting is true, modal errors will disappear when they are clicked on.
            modalErrorsClickable: true,

            // If a field name cannot be otherwise inferred, this will be used.
            defaultFieldName: "This field"
        },
        
        // jQuery selector to filter down to validation supported elements.
        elementSupport = ":text, :password, textarea, select, :radio, :checkbox";
    
    // Setup 'static' functions and properties for the validity plugin.
    $.validity = {
        // Clone the defaults. They can be overridden with the setup function.
        settings:$.extend(defaults, {}),

        // Built-in library of format-checking tools for use with the 
        // match validator (as well as the nonHtml validator).
        patterns:{
            integer: /^\d+$/,
            date: function(val) { return !isNaN(Date.parse(val)); },
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            usd: /^\$?(\d{1,3},?(\d{3},?)*\d{3}(\.\d{0,2})?|\d{1,3}(\.\d{0,2})?|\.\d{1,2}?)$/,
            url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
            number: function(val) { return !isNaN(parseFloat(val)); },
            zip: /^\d{5}(-\d{4})?$/,
            phone: /^[2-9]\d{2}-\d{3}-\d{4}$/,
            guid: /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/,
            time12: /^[01]?[0-9]:[0-5][0-9]?\s?[aApP]\.?[mM]\.?$/,
            time24: /^(20|21|22|23|[01]\d|\d)(([:][0-5]\d){1,2})$/,

            nonHtml: /[^<>]/g
        },

        // Built-in set of default error messages (for use when message isn't specified).
        messages:{
            require:"#{field} is required.",

            // Format validators:
            match:"#{field} is in an invalid format.",
            integer:"#{field} must be a positive, whole number.",
            date:"#{field} must be formatted as a date.",
            email:"#{field} must be formatted as an email.",
            usd:"#{field} must be formatted as a US Dollar amount.",
            url:"#{field} must be formatted as a URL.",
            number:"#{field} must be formatted as a number.",
            zip:"#{field} must be formatted as a zipcode ##### or #####-####.",
            phone:"#{field} must be formatted as a phone number ###-###-####.",
            guid:"#{field} must be formatted as a guid like {3F2504E0-4F89-11D3-9A0C-0305E82C3301}.",
            time24:"#{field} must be formatted as a 24 hour time: 23:00.",
            time12:"#{field} must be formatted as a 12 hour time: 12:00 AM/PM",

            // Value range messages:
            lessThan:"#{field} must be less than #{max}.",
            lessThanOrEqualTo:"#{field} must be less than or equal to #{max}.",
            greaterThan:"#{field} must be greater than #{min}.",
            greaterThanOrEqualTo:"#{field} must be greater than or equal to #{min}.",
            range:"#{field} must be between #{min} and #{max}.",

            // Value length messages:
            tooLong:"#{field} cannot be longer than #{max} characters.",
            tooShort:"#{field cannot be shorter than #{min} characters.}",

            // Aggregate validator messages:
            equal:"Values don't match.",
            distinct:"A value was repeated.",
            sum:"Values don't add to #{sum}.",
            sumMax:"The sum of the values must be less than #{max}.",
            sumMin:"The sum of the values must be greater than #{min}.",

            nonHtml:"#{field} cannot contain Html characters.",

            generic:"Invalid."
        },

        // Object to contain the output modes. The three built-in output modes are installed
        // later on in this script.
        outputs:{},

        // Override the default settings with user-specified ones.
        setup:function(options) {
            this.settings = $.extend(this.settings, options);
        },

        // Object to store information about ongoing validation.
        // When validation starts, this will be set to a report object.
        // When validators fail, they will inform this object.
        // When validation is completed, this object will contain the 
        // information of whether it succeeded.
        report:null,

        // Determine whether validity is in the middle of validation.
        isValidating:function() {
            return !!this.report;
        },

        // Function to prepare validity to start validating.
        start:function() {
            // The output mode should be notified that validation is starting.
            // This usually means that the output mode will erase errors from the 
            // document in whatever way the mode needs to.
            if (this.outputs[this.settings.outputMode] &&
                this.outputs[this.settings.outputMode].start) {
                this.outputs[this.settings.outputMode].start();
            }

            // Initialize the report object.
            this.report = { errors:0, valid:true };
        },

        // Function called when validation is over to examine the results and clean-up.
        end:function() {
            // Notify the current output mode that validation is over.
            if (this.outputs[this.settings.outputMode] &&
                this.outputs[this.settings.outputMode].end) {
                this.outputs[this.settings.outputMode].end();
            }

            // Null coalescence: fix for Issue 5
            var results = this.report || { errors: 0, valid: true };

            this.report = null;

            // If there was at least one error, scrollTo is enabled, an output mode is specified,
            // and if that output mode has a scrollToFirstError method, then scroll to that error.
            if (!results.valid &&
                this.settings.scrollTo &&
                this.outputs[this.settings.outputMode] &&
                this.outputs[this.settings.outputMode].scrollToFirstError) {
                this.outputs[this.settings.outputMode].scrollToFirstError();
            }

            return results;
        },

        // Remove validiation errors:
        clear:function() {
            this.start();
            this.end();
        }
    };

    // Add functionality to jQuery objects:
    $.fn.extend({
        // The validity function is how validation can be bound to forms.
        // The user may pass in a validation function as described in the docs,
        // or, as a shortcut, pass in a string of a CSS selector that grabs all 
        // the inputs to require.
        validity:function(arg) {
            return this.each(
                function() {
                    // Only operate on forms:
                    if (this.tagName.toLowerCase() == "form") {
                        var f = null;

                        // If the user entered a string of the inputs to require,
                        // then make the validation logic ad hoc.
                        if (typeof (arg) == "string") {
                            f = function() {
                                $(arg).require();
                            };
                        }

                        // If the user entered a validation function then just call
                        // that at the appropriate time.
                        else if ($.isFunction(arg)) {
                            f = arg;
                        }

                        if (arg) {
                            $(this).bind(
                                "submit",
                                function() {
                                    $.validity.start();
                                    f();
                                    return $.validity.end().valid;
                                }
                            );
                        }
                    }
                }
            );
        },

        // Start defining validators //
        ///////////////////////////////

        // Validate whether the field has a value.
        // http://code.google.com/p/validity/wiki/Validators#Require
        require:function(msg) {
            return validate(
                this,
                function(obj) {
                    return obj.value.length;
                },
                msg || $.validity.messages.require
            );
        },

        // Validate whether the field matches a regex.
        // http://code.google.com/p/validity/wiki/Validators#Match
        match:function(rule, msg) {
            // If a default message is to be used:
            if (!msg) {
                // First grab the generic one:
                msg = $.validity.messages.match;

                // If there's a more specific one, use that.
                if (typeof (rule) === "string" && $.validity.messages[rule]) {
                    msg = $.validity.messages[rule];
                }
            }

            // If the rule is named, rather than specified:
            if (typeof (rule) == "string") {
                rule = $.validity.patterns[rule];
            }

            return validate(
                this,

                // Some of the named rules can be functions, such as 'date'.
                // If the discovered rule is a function use it as such.
                // Otherwise, assume it's a RegExp.
                $.isFunction(rule) ?

                    function(obj) {
                        return !obj.value.length || rule(obj.value);
                    } :

                    function(obj) {
                        return !obj.value.length || rule.test(obj.value);
                    },

                msg
            );
        },

        // http://code.google.com/p/validity/wiki/Validators#Range
        range:function(min, max, msg) {
            return validate(
                this,

                min.getTime && max.getTime ?

                    // If both arguments are dates then use them that way.
                    function(obj) {
                        var d = new Date(obj.value);
                        return d >= new Date(min) && d <= new Date(max);
                    } :

                    // Otherwise treat them like floats.
                    function(obj) {
                        var f = parseFloat(obj.value);
                        return f >= min && f <= max;
                    },

                msg || format(
                    $.validity.messages.range, {
                        min:argToString(min),
                        max:argToString(max)
                    }
                )
            );
        },

        // http://code.google.com/p/validity/wiki/Validators#GreaterThan
        greaterThan:function(min, msg) {
            return validate(
                this,

                min.getTime ?
                    function(obj) {
                        return new Date(obj.value) > min;
                    } :

                    function(obj) {
                        return parseFloat(obj.value) > min;
                    },

                msg || format(
                    $.validity.messages.greaterThan, {
                        min:argToString(min)
                    }
                )
            );
        },

        // http://code.google.com/p/validity/wiki/Validators#GreaterThanOrEqualTo
        greaterThanOrEqualTo:function(min, msg) {
            return validate(
                this,

                min.getTime ?
                    function(obj) {
                        return new Date(obj.value) >= min;
                    } :

                    function(obj) {
                        return parseFloat(obj.value) >= min;
                    },

                msg || format(
                    $.validity.messages.greaterThanOrEqualTo, {
                        min:argToString(min)
                    }
                )
            );
        },

        // http://code.google.com/p/validity/wiki/Validators#LessThan
        lessThan:function(max, msg) {
            return validate(
                this,

                max.getTime ?
                    function(obj) {
                        return new Date(obj.value) < max;
                    } :

                    function(obj) {
                        return parseFloat(obj.value) < max;
                    },

                msg || format(
                    $.validity.messages.lessThan, {
                        max:argToString(max)
                    }
                )
            );
        },

        // http://code.google.com/p/validity/wiki/Validators#LessThanOrEqualTo
        lessThanOrEqualTo:function(max, msg) {
            return validate(
                this,

                max.getTime ?
                    function(obj) {
                        return new Date(obj.value) <= max;
                    } :

                    function(obj) {
                        return parseFloat(obj.value) <= max;
                    },

                msg || format(
                    $.validity.messages.lessThanOrEqualTo, {
                        max:argToString(max)
                    }
                )
            );
        },

        // http://code.google.com/p/validity/wiki/Validators#MaxLength
        maxLength:function(max, msg) {
            return validate(
                this,
                function(obj) {
                    return obj.value.length <= max;
                },
                msg || format(
                    $.validity.messages.tooLong, {
                        max:max
                    }
                )
            );
        },

        // http://code.google.com/p/validity/wiki/Validators#MinLength
        minLength:function(min, msg) {
            return validate(
                this,
                function(obj) {
                    return obj.value.length >= min;
                },
                msg || format(
                    $.validity.messages.tooShort, {
                        min:min
                    }
                )
            );
        },

        // Validate that all matched elements bear the same values.
        // Accepts a function to transform the values for testing.
        // http://code.google.com/p/validity/wiki/Validators#Equal
        equal:function(arg0, arg1) {
            var 
                // If a reduced set is attached, use it.
                // Also, remove unsupported elements.
                $reduction =  (this.reduction || this).filter(elementSupport),

                transform = function(val) {
                    return val;
                },

                msg = $.validity.messages.equal;

            if ($reduction.length) {
                // Figure out what arguments were specified.
                if ($.isFunction(arg0)) {
                    transform = arg0;

                    if (typeof (arg1) == "string") {
                        msg = arg1;
                    }
                }

                else if (typeof (arg0) == "string") {
                    msg = arg0;
                }

                var 
                    map = $.map(
                        $reduction,
                        function(obj) {
                            return transform(obj.value);
                        }
                    ),

                    // Get the first value.
                    first = map[0],
                    valid = true;

                // If any value is not equal to the first value,
                // then they aren't all equal, and it's not valid.
                for (var i in map) {
                    if (map[i] != first) {
                        valid = false;
                    }
                }

                if (!valid) {
                    raiseAggregateError($reduction, msg);

                    // The set reduces to zero valid elements.
                    this.reduction = $([]);
                }
            }

            return this;
        },

        // Validate that all matched elements bear distinct values.
        // Accepts an optional function to transform the values for testing.
        // http://code.google.com/p/validity/wiki/Validators#Distinct
        distinct:function(arg0, arg1) {
            var 
                // If a reduced set is attached, use it.
                // Also, remove unsupported elements.
                $reduction =  (this.reduction || this).filter(elementSupport),

                transform = function(val) {
                    return val;
                },

                msg = $.validity.messages.distinct,

                // An empty array to store already-examined values
                subMap = [],

                valid = true;

            if ($reduction.length) {

                // Figure out what arguments were specified.
                if ($.isFunction(arg0)) {
                    transform = arg0;

                    if (typeof (arg1) == "string") {
                        msg = arg1;
                    }
                }

                else if (typeof (arg0) == "string") {
                    msg = arg0;
                }

                // Map all the matched values into an array.    
                var map = $.map(
                    $reduction,
                    function(obj) {
                        return transform(obj.value);
                    }
                );

                // For each transformed value:
                for (var i1 = 0; i1 < map.length; i1++) {
                    // Unless it's an empty string:
                    if (map[i1].length) {
                        // For each value we've already looked at:
                        for (var i2 = 0; i2 < subMap.length; i2++) {
                            // If we've already seen the transformed value:
                            if (subMap[i2] == map[i1]) {
                                valid = false;
                            }
                        }

                        // We looked at the value.
                        subMap.push(map[i1]);
                    }
                }

                if (!valid) {
                    raiseAggregateError($reduction, msg);

                    // The set reduces to zero valid elements.
                    this.reduction = $([]);
                }
            }

            return this;
        },

        // Validate that the numeric sum of all values is equal to a given value.
        // http://code.google.com/p/validity/wiki/Validators#Sum
        sum:function(sum, msg) {
            // If a reduced set is attached, use it.
            // Also, remove unsupported elements.
            var $reduction =  (this.reduction || this).filter(elementSupport);

            if ($reduction.length && sum != numericSum($reduction)) {
                raiseAggregateError(
                    $reduction,
                    msg || format(
                        $.validity.messages.sum,
                        { sum:sum }
                    )
                );

                // The set reduces to zero valid elements.
                this.reduction = $([]);
            }

            return this;
        },

        // Validates an inclusive upper-bound on the numeric sum of the values of all matched elements.
        // http://code.google.com/p/validity/wiki/Validators#SumMax
        sumMax:function(max, msg) {
            // If a reduced set is attached, use it.
            // Also, remove unsupported elements.
            var $reduction =  (this.reduction || this).filter(elementSupport);

            if ($reduction.length && max < numericSum($reduction)) {
                raiseAggregateError(
                    $reduction,
                    msg || format(
                        $.validity.messages.sumMax,
                        { max:max }
                    )
                );

                // The set reduces to zero valid elements.
                this.reduction = $([]);
            }

            return this;
        },

        // Validates an inclusive lower-bound on the numeric sum of the values of all matched elements.
        // http://code.google.com/p/validity/wiki/Validators#SumMin
        sumMin:function(min, msg) {
            // If a reduced set is attached, use it.
            // Also, remove unsupported elements.
            var $reduction =  (this.reduction || this).filter(elementSupport);

            if ($reduction.length && min < numericSum($reduction)) {
                raiseAggregateError(
                    $reduction,
                    msg || format(
                        $.validity.messages.sumMin,
                        { min:min }
                    )
                );

                // The set reduces to zero valid elements.
                this.reduction = $([]);
            }

            return this;
        },

        // Validate that the input does not contain potentially dangerous strings.
        nonHtml:function(msg) {
            return validate(
                this,

                function(obj) {
                    return $.validity.patterns.nonHtml.test(obj.value);
                },

                msg || $.validity.messages.nonHtml
            );
        },

        // If expression is a function, it will be called on each matched element.
        // Otherwise, it is treated as a boolean, and the determines the validity 
        // of elements in an aggregate fashion.
        // http://code.google.com/p/validity/wiki/Validators#Assert
        assert:function(expression, msg) {
            // If a reduced set is attached, use it.
            // Also, remove unsupported elements.
            var $reduction =  (this.reduction || this).filter(elementSupport);

            if ($reduction.length) {

                // In the case that 'expression' is a function, 
                // use it as a regimen on each matched element individually:
                if ($.isFunction(expression)) {
                    return validate(
                        this,
                        expression,
                        msg || $.validity.messages.generic
                    );
                }

                // Otherwise map it to a boolean and consider this as an aggregate validation:
                else if (!expression) {

                    raiseAggregateError(
                        $reduction,
                        msg || $.validity.messages.generic
                    );

                    // The set reduces to zero valid elements.
                    this.reduction = $([]);
                }
            }

            return this;
        }

        // End defining validators //
        /////////////////////////////
    });

    // Start defining internal utilities //
    ///////////////////////////////////////

    // Do non-aggregate validation.
    // Subject each element in $obj to the regimen.
    // Raise the specified error on failures.
    // This function is the heart of validity.
    function validate($obj, regimen, message) {
        var 
            // If a reduced set is attached, use it
            // Also, remove any unsupported elements.
            $reduction = ($obj.reduction || $obj).filter(elementSupport),

            // Array to store only elements that pass the regimen.
            elements = [];

        // For each in the reduction.
        $reduction.each(
            function() {
                // If the element passes the regimen, include it in the reduction.
                if (regimen(this)) {
                    elements.push(this);
                }

                // Else give the element an error message.
                else {
                    raiseError(
                        this,
                        format(message, {
                            field:infer(this)
                        })
                    );
                }
            }
        );

        // Attach a (potentially) reduced set of only elements that passed.
        $obj.reduction = $(elements);

        // Return the full set with attached reduction.
        return $obj;
    }

    // Inform the report object that there was a failure.
    function addToReport() {
        if ($.validity.isValidating()) {
            $.validity.report.errors++;
            $.validity.report.valid = false;
        }
    }

    // Inform the report of a failure and display an error according to the 
    // idiom of the current ouutput mode.
    function raiseError(obj, msg) {
        addToReport();

        if ($.validity.outputs[$.validity.settings.outputMode] &&
            $.validity.outputs[$.validity.settings.outputMode].raise) {
            $.validity.outputs[$.validity.settings.outputMode].raise($(obj), msg);
        }
    }

    // Inform the report of a failure and display an aggregate error according to the 
    // idiom of the current output mode.
    function raiseAggregateError($obj, msg) {
        addToReport();

        if ($.validity.outputs[$.validity.settings.outputMode] &&
            $.validity.outputs[$.validity.settings.outputMode].raiseAggregate) {
            $.validity.outputs[$.validity.settings.outputMode].raiseAggregate($obj, msg);
        }
    }

    // Yield the sum of the values of all fields matched in obj that can be parsed.
    function numericSum(obj) {
        var accumulator = 0;
        obj.each(
            function() {
                var n = parseFloat(this.value);

                accumulator += isNaN(n) ? 0 : n;
            }
        );
        return accumulator;
    }

    // Using the associative array supplied as the 'obj' argument,
    // replace tokens of the format #{<key>} in the 'str' argument with
    // that key's value.
    function format(str, obj) {
        for (var p in obj) {
            str = str.replace("#{" + p + "}", obj[p]);
        }
        return capitolize(str);
    }

    // Infer the field name of the passed DOM element.
    // If a title is specified, its value is returned.
    // Otherwise, attempt to parse a field name out of the id attribute.
    // If that doesn't work, return the default field name in the configuration.
    function infer(field) {
        var 
            $f = $(field),
            ret = $.validity.settings.defaultFieldName;

        // Check for title.
        if ($f.attr("title").length) {
            ret = $f.attr("title");
        }

        // Check for UpperCamelCase.
        else if (/^([A-Z0-9][a-z]*)+$/.test(field.id)) {
            ret = field.id.replace(/([A-Z0-9])[a-z]*/g, " $&");
        }

        // Check for lowercase_separated_by_underscores
        else if (/^[a-z0-9_]*$/.test(field.id)) {
            var arr = field.id.split("_");

            for (var i in arr) {
                arr[i] = capitolize(arr[i]);
            }

            ret = arr.join(" ");
        }

        return ret;
    }

    function argToString(val) {
        return val.getDate ?
            (val.getMonth() + 1) + "/" + val.getDate() + "/" + val.getFullYear() :
            val;
    }

    // Capitolize the first character of the string argument.
    function capitolize(sz) {
        return sz.substring ?
            sz.substring(0, 1).toUpperCase() + sz.substring(1, sz.length) :
            sz;
    }

    // End defining internal utilities //
    /////////////////////////////////////

    // Start installing output modes //
    ///////////////////////////////////

    // Install the label output.
    (function() {
        function getSelector($obj) {
            return $obj.attr('id').length ?
                ("#" + $obj.attr('id')) :
                ("[name='" + $obj.attr('name') + "']");
        }

        function getIdentifier($obj) {
            return $obj.attr('id').length ?
                $obj.attr('id') :
                $obj.attr('name');
        }

        $.validity.outputs.label = {
            start:function() {
                // Remove all the existing error labels.
                $("label.error").remove();
            },

            raise:function($obj, msg) {
                var 
                    //errorId = $obj.attr('id'),
                    errorSelector = getSelector($obj),
                    labelSelector = "label.error[for='" + getIdentifier($obj) + "']";

                // If an error label already exists for the bad input just update its text:
                if ($(labelSelector).length) {
                    $(labelSelector).text(msg);
                }

                // Otherwize create a new one and stick it after the input:
                else {
                    $("<label/>")
                        .attr("for", getIdentifier($obj))
                        .addClass("error")
                        .text(msg)

                        // In the case that the element does not have an id
                        // then the for attribute in the label will not cause
                        // clicking the label to focus the element. This line 
                        // will make that happen.
                        .click(function() {
                            if ($obj.length) {
                                $obj[0].select();
                            }
                        })

                        .insertAfter($obj);
                }
            },

            raiseAggregate:function($obj, msg) {
                // Just raise the error on the last input.
                if ($obj.length) {
                    this.raise($($obj.get($obj.length - 1)), msg);
                }
            },

            scrollToFirstError:function() {
                if ($("label.error").length) {
                    location.hash = $("label.error:eq(0)").attr('for');
                }
            }
        };
    })();

    // Install the modal output.
    (function() {
        var 
            // Class to apply to modal errors.
            errorClass = "validity-modal-msg",
            
            // The selector for the element where modal errors will me injected semantically.
            container = "body";
            
        $.validity.outputs.modal = {
            start:function() {
                // Remove all the existing errors.
                $("." + errorClass).remove();
            },

            raise:function($obj, msg) {
                if ($obj.length) {
                    var 
                        off = $obj.offset(),
                        obj = $obj.get(0),

                        // Design a style object based off of the input's location.
                        errorStyle = {
                            left:parseInt(off.left + $obj.width() + 4) + "px",
                            top:parseInt(off.top - 10) + "px"
                        };
                        
                    // Create one and position it next to the input.
                    $("<div/>")
                        .addClass(errorClass)
                        .css(errorStyle)
                        .text(msg)
                        .click($.validity.settings.modalErrorsClickable ?
                            function() { $(this).remove(); } : null
                        )
                        .appendTo(container);
                }
            },

            raiseAggregate:function($obj, msg) {
                // Just raise the error on the last input.
                if ($obj.length) {
                    this.raise($($obj.get($obj.length - 1)), msg);
                }
            },

            scrollToFirstError:function() {
                location.hash = $("." + errorClass + ":eq(0)").attr('id')
            }
        };
    })();

    // Install the summary output
    (function() {
        var 
            // Container contains the summary. This is the element that is shown or hidden.
            container = "#validity-summary-container",
            
            // Summary is the element that contains the messages.
            // This should be an UL element.
            summary = "#validity-summary-output",
            
            // Erroneous refers to an input with an invalid value,
            // not the error message itself.
            erroneous = "validity-erroneous",
            
            // Selector for erroneous inputs.
            errors = "." + erroneous,
            
            // The wrapper for entries in the summary.
            wrapper = "<li/>",

            // Buffer to contain all the error messages that build up during validation.
            // When validation ends, it'll be flushed into the summary.
            // This way, the summary doesn't flicker empty then fill up.
            buffer = [];

        $.validity.outputs.summary = {
            start:function() {
                $(errors).removeClass(erroneous);
                buffer = [];
            },

            end:function() {
                // Hide the container and empty its summary.
                $(container)
                    .hide()
                    .find(summary)
                        .html('');

                // If there are any errors at all:
                // (Otherwise the container shouldn't be shown):
                if (buffer.length) {
                    // Use integer based iteration for solution to Issue 7.
                    for (var i = 0; i < buffer.length; i++) {
                        $(wrapper)
                            .text(buffer[i])
                            .appendTo(summary);
                    }

                    $(container).show();
                }
            },

            raise:function($obj, msg) {
                buffer.push(msg);
                $obj.addClass(erroneous);
            },

            raiseAggregate:function($obj, msg) {
                this.raise($obj, msg);
            },

            scrollToFirstError:function() {
                location.hash = $(errors + ":eq(0)").attr("id");
            }
        };
    })();

    // End installing output modes //
    /////////////////////////////////
})(jQuery);
