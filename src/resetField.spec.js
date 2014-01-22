describe('amResetField', function() {
  'use strict';

  var scope, $compile;
  var validElement = '<input type="text" ng-model="foo" am-reset-field />';

  beforeEach(module('am.resetField'));
  beforeEach(inject(function(_$rootScope_, _$compile_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  describe('compiling the directive', function()
  {
    it('should throw an error if a model is absent', function() {
      function template() {
        return $compile('<input type="text" am-reset-field />')(scope);
      }
      expect(template).toThrow();
    });

    it('should throw an error if the element is not "input"', function() {
      function template() {
        return $compile('<select ng-model="foo" am-reset-field />')(scope);
      }
      expect(template).toThrow(new Error("resetField is limited to input elements"));
    });

    it('should throw an error if the type is invalid', function() {
      function template() {
        return $compile('<input type="radio" ng-model="foo" am-reset-field />')(scope);
      }
      expect(template).toThrow(new Error("Invalid input type for resetField: radio"));
    });

    ['text', 'search', 'tel', 'url', 'email', 'password'].forEach(function(type) {
      it('should not throw an error if the type is "' + type + '"', function() {
        function template() {
          return $compile('<input type="' + type + '" ng-model="foo" am-reset-field />')(scope);
        }
        expect(template).not.toThrow();
      });
    });

    it('should append the icon element as a sibling', function() {
      var element = $compile(validElement)(scope);
      expect(element.next().hasClass('fa')).toBeTruthy();
    });

  });

  describe('icon visibility', function() {
    it('should be hidden on compile', function() {
      var element = $compile(validElement)(scope);
      scope.$digest();
      expect(element.isolateScope().enabled).toBeFalsy();
      expect(element.next().hasClass('ng-hide')).toBeTruthy();
    });

    it('should be visible when text exists in input and focus is gained', function() {
      var element = $compile(validElement)(scope);
      element.val('foo').triggerHandler('focus');
      expect(element.isolateScope().enabled).toBeTruthy();
      expect(element.next().hasClass('ng-hide')).toBeFalsy();
    });

    it('should be hidden when text exists in input and focus is lost', function() {
      var element = $compile(validElement)(scope);
      element.val('foo').triggerHandler('focus');
      element.triggerHandler('blur');
      expect(element.isolateScope().enabled).toBeFalsy();
      expect(element.next().hasClass('ng-hide')).toBeTruthy();
    });

    it('should be hidden when text is completely deleted in input', function() {
      var element = $compile(validElement)(scope);
      element.val('foo').triggerHandler('focus');
      element.val(null).triggerHandler('focus');
      expect(element.isolateScope().enabled).toBeFalsy();
      expect(element.next().hasClass('ng-hide')).toBeTruthy();
    });
  });

  describe('clicking icon', function() {
    it('should clear the text content and reset the model', function() {
      var element = $compile(validElement)(scope);

      scope.$apply('foo = "foo"');
      expect(element.val()).toBe('foo');

      spyOn(element.isolateScope(), 'reset').andCallThrough();
      element.next().triggerHandler('mousedown');

      expect(element.val()).toBe('');
      expect(element.scope().foo).toBe(null);
      expect(element.isolateScope().reset).toHaveBeenCalled();
    });
  });

});