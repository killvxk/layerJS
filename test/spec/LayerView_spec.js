var LayerView = require('../../src/framework/layerview.js');
var StageView = require('../../src/framework/stageview.js');
var state = require('../../src/framework/state.js');

var ViewsGroupViewTests = require('./helpers/views/group/viewtests.js');

var ViewsCommonParseTests = require('./helpers/views/common/parsetests.js');
var ViewsCommon_renderChildPositionTests = require('./helpers/views/common/_renderchildpositiontests.js');
var ViewsCommon_parseChildrenTests = require('./helpers/views/common/_parseChildrentests.js');
var ViewsGroup_parseChildrenTests = require('./helpers/views/group/_parseChildrentests.js');

var ViewsCommonIdentifyTests = require('./helpers/views/common/identifytests.js');
var ViewsCommonViewTests = require('./helpers/views/common/viewtests.js');

describe("LayerView", function() {

  var utilities = require('./helpers/utilities.js');

  ViewsCommonViewTests('layer_nochildren_1.js', function() {
    return {
      ViewType: LayerView,
      htmlElement: require('./htmlelements/layer_nochildren_1.js')
    }
  });

  ViewsCommon_renderChildPositionTests('simple_layer_1.js', function() {
    return {
      htmlElement: require('./htmlelements/simple_layer_1.js'),
      ViewType: LayerView
    };
  });

  ViewsCommonIdentifyTests('div data-lj-type="layer"', LayerView, function() {
    var element = document.createElement('div');
    element.setAttribute('data-lj-type', 'layer');

    return element;
  }, true);

  ViewsCommonIdentifyTests('div', LayerView, function() {
    return document.createElement('div');
  }, false);

  it('the Parse method will set nativeScroll to true if the DOM element has a data-lj-native-scroll attribute equals true', function() {
    var element = utilities.appendChildHTML('<div lj-native-scroll="true"><div lj-helper="scroller"></div></div>');
    var layerView = new LayerView({
      el: element
    });

    expect(layerView.nativeScroll()).toBeTruthy();
  });

  it('the Parse method will set nativeScroll to false if the DOM element has a data-lj-native-scroll attribute equals false', function() {
    var element = utilities.appendChildHTML('<div lj-native-scroll="false"></div>');

    var layerView = new LayerView({
      el: element
    });
    expect(layerView.nativeScroll()).toBeFalsy();
  });

  it('show frame will trigger events', function(done) {
    var html = "<div data-lj-type='stage' id='stage1'>" +
      "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
      "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
      "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
      "</div>" +
      "</div>";

    var element = utilities.appendChildHTML(html);

    var stageView1 = new StageView({
      el: element
    });

    var layerView1 = document.getElementById('layer1')._ljView;
    var beforeTransition = false;
    var transitionStarted = false;
    var transitionFinished = false;

    layerView1.on('beforeTransition', function() {
      beforeTransition = true;
    });
    layerView1.on('transitionStarted', function() {
      transitionStarted = true;
    });
    layerView1.on('transitionFinished', function() {
      transitionFinished = true;
    });
    layerView1.showFrame('frame2');

    setTimeout(function() {
      expect(beforeTransition).toBeTruthy();
      expect(transitionStarted).toBeTruthy();
      expect(transitionFinished).toBeTruthy();
      done();
    }, 100);
  });

  ViewsCommon_parseChildrenTests(function() {
    return {
      ViewType: LayerView,
      htmlElement: require('./htmlelements/simple_layer_1.js'),
      expectedChildren: ['simple_frame_1']
    }
  });

  describe('can transition to special frame name', function() {

    function check(html, specialFrameName, expectedFrameName, done) {
      var element = utilities.appendChildHTML(html);

      var stageView1 = new StageView({
        el: element
      });

      var layerView1 = document.getElementById('layer1')._ljView;

      layerView1.transitionTo(specialFrameName);
      setTimeout(function() {
        if (null === expectedFrameName) {
          expect(layerView1.currentFrame).toBe(null);
        } else {
          expect(layerView1.currentFrame.name()).toBe(expectedFrameName);
        }
        done();
      }, 100);
    }

    it('!none', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
        "</div>" +
        "</div>", '!none', null, done);
    });

    it('!next', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!next', 'frame2', done);
    });

    it('!prev', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame2'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "</div>" +
        "</div>", '!prev', 'frame1', done);
    });

    it('!left', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.l='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!left', 'frame2', done);
    });

    it('!right', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.r='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!right', 'frame2', done);
    });

    it('!top', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.t='frame2'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!top', 'frame2', done);
    });

    it('!bottom', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.b='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!bottom', 'frame2', done);
    });
  });

  describe('can show to special frame name', function() {

    function check(html, specialFrameName, expectedFrameName, done) {
      var element = utilities.appendChildHTML(html);

      var stageView1 = new StageView({
        el: element
      });

      var layerView1 = document.getElementById('layer1')._ljView;

      layerView1.showFrame(specialFrameName);
      setTimeout(function() {
        if (null === expectedFrameName) {
          expect(layerView1.currentFrame).toBe(null);
        } else {
          expect(layerView1.currentFrame.name()).toBe(expectedFrameName);
        }
        done();
      }, 100);
    }

    it('!none', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
        "</div>" +
        "</div>", '!none', null, done);
    });

    it('!next', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!next', 'frame2', done);
    });

    it('!prev', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame2'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "</div>" +
        "</div>", '!prev', 'frame1', done);
    });

    it('!left', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.l='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!left', 'frame2', done);
    });

    it('!right', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.r='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!right', 'frame2', done);
    });

    it('!top', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.t='frame2'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!top', 'frame2', done);
    });

    it('!bottom', function(done) {
      check("<div data-lj-type='stage' id='stage1'>" +
        "<div data-lj-type='layer' id='layer1' data-lj-default-frame='frame1'>" +
        "<div data-lj-type='frame' id='frame1' data-lj-name='frame1' data-lj-neighbors.b='frame2'></div>" +
        "<div data-lj-type='frame' id='frame3' data-lj-name='frame3'></div>" +
        "<div data-lj-type='frame' id='frame2' data-lj-name='frame2'></div>" +
        "</div>" +
        "</div>", '!bottom', 'frame2', done);
    });
  });

  /*
  ViewsGroupViewTests('simple_layerdata.js', function() {
    return {
      data: require('./datasets/simple_layerdata.js'),
      ViewType: LayerView,
      parentId: 5
    };
  });

    ViewsGroupViewTests('test_data_set.js', function() {
      return {
        data: JSON.parse(JSON.stringify(require('./datasets/test_data_set.js'))),
        ViewType: LayerView,
        parentId: 5
      };
    });

  //Refactoring: Already tested
    ViewsCommon_renderChildPositionTests('test_data_set.js', function() {
      return {
        data: require('./datasets/test_data_set.js'),
        ViewType: LayerView,
        parentId: 5
      };
    });

  //  Refactoring: no need to parse anymore
    ViewsCommonParseTests(function() {
      return {
        ViewType: LayerView
      }
    });

  */

  /*
   // Refactoring: tested in common _parsechildrentests.js
    ViewsGroup_parseChildrenTests(function() {
      return {
        ViewType: LayerView,
        viewTypeName: 'LayerView',
        type: 'layer',
        HTML: "<div id='100' data-lj-id='100' data-lj-type='layer'>" +
          "<div id='101' data-lj-id='101' data-lj-type='frame'></div>" +
          "<div id='102' data-lj-id='102' data-lj-type='frame'></div>" +
          "<div/>" +
          "</div>",
        expectedChildren: ['101', '102']
      };
    });

  */

})
