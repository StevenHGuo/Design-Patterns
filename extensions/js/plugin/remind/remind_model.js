$(function () {
  window.Modal = function () {

    /*---------------------------弹出框模板---------------------------*/
    var html =
      '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">'
      + '<div class="modal-dialog modal-sm">'
      + '<div class="modal-content">'
      + '<div class="modal-header">'
      + '<h4 class="modal-title" id="modalLabel">[Title]</h4>'
      + '</div>'
      + '<div class="modal-body">'
      + '<p style="width:278px;word-wrap:break-word; word-break:normal;">[Message]</p>'
      + '</div>'
      + '<div class="modal-footer">'
      + '<button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>'
      + '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';

    var dialogdHtml =
      '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">'
      + '<div class="modal-dialog">'
      + '<div class="modal-content">'
      + '<div class="modal-header">'
      + '<h4 class="modal-title" id="modalLabel">[Title]</h4>'
      + '</div>'
      + '<div class="modal-body">'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';

    //替换的正则表达式
    var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');

    //提示框ID生成策略
    var generateId = function () {
      var date = new Date();
      return 'mdl' + date.valueOf();
    }

    /**初始化： 1.对参数进行处理
          2.生成ID
          3.根据参数生成相应的内容
          4.将生成的标签内容添加到页面中去
          5.配置相关参数
      */
    var init = function (options, is_static) {
      //将默认的要求与用户输入的参数进行处理
      options = $.extend(
        {},
        {
          title: "Message",
          message: "提示内容",
          btnok: "Confirm",
          btncl: "Cancel",
          width: 200,
          auto: false
        },
        options || {}
      );
      var modalId = generateId();
      //替换相应的内容
      var content = html.replace(reg, function (node, key) {
        return {
          Id: modalId,
          Title: options.title,
          Message: options.message,
          BtnOk: options.btnok,
          BtnCancel: options.btncl
        }[key];
      });
      //将生成的标签内容添加到页面中去
      $('body').append(content);
      if (is_static) {
        $('#' + modalId).modal({
          width: options.width,
          backdrop: 'static'
        });
      } else {
        $('#' + modalId).modal({
          width: options.width
        });
      }

      $('#' + modalId).on('hide.bs.modal', function (e) {
        $('body').find('#' + modalId).remove();
      });
      return modalId;
    }

    return {
      alert: function (options) {
        if (typeof options == 'string') {
          options = {
            message: options
          };
        }
        var id = init(options, false);
        var modal = $('#' + id);
        modal.find('.ok').removeClass('btn-success').addClass('btn-primary');
        modal.find('.cancel').hide();

        return {
          id: id,
          on: function (callback) {
            if (callback && callback instanceof Function) {
              modal.find('.ok').click(function () { callback(true); });
            }
          },
          hide: function (callback) {
            if (callback && callback instanceof Function) {
              modal.on('hide.bs.modal', function (e) {
                callback(e);
              });
            }
          }
        };
      },
      confirm: function (options) {
        var id = init(options, true);
        var modal = $('#' + id);
        modal.find('.ok').removeClass('btn-primary').addClass('btn-success');
        modal.find('.cancel').show();
        return {
          id: id,
          on: function (callback) {
            if (callback && callback instanceof Function) {
              modal.find('.ok').click(function () { callback(true); });
              modal.find('.cancel').click(function () { callback(false); });
            }
          },
          hide: function (callback) {
            if (callback && callback instanceof Function) {
              modal.on('hide.bs.modal', function (e) {
                callback(e);
              });
            }
          }
        };
      },
      dialog: function (options) {
        options = $.extend({}, {
          title: 'title',
          url: '',
          width: 800,
          height: 550,
          onReady: function () { },
          onShown: function (e) { }
        }, options || {});
        var modalId = generateId();

        var content = dialogdHtml.replace(reg, function (node, key) {
          return {
            Id: modalId,
            Title: options.title
          }[key];
        });
        $('body').append(content);
        var target = $('#' + modalId);
        target.find('.modal-body').load(options.url);
        if (options.onReady())
          options.onReady.call(target);
        target.modal();
        target.on('shown.bs.modal', function (e) {
          if (options.onReady(e))
            options.onReady.call(target, e);
        });
        target.on('hide.bs.modal', function (e) {
          $('body').find(target).remove();
        });
      }
    }
  } ();
});