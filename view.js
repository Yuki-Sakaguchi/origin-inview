const ViewEvent = function(selector, options) {
  let _target;
  let _options = {
    offset: 0,
    callback: function(t) {
      console.log('処理が設定されていません。');
    }
  };

  switch(typeof selector) {
    case 'string':
      _target = document.querySelectorAll(selector);
      break;
    case 'object':
      _target = selector;
      break;
    default:
      Error('対象が取得できませんでした。');
  }

  switch(typeof options) {
    case 'object':
      // オプションを連想配列で渡された前提
      Object.keys(options).forEach(function(key) {
        _options[key] = options[key];
      });
      break;
    case 'function':
      // オプションはデフォルトでcallbackを渡された前提
      _options.callback = options;
      break;
    default:
      Error('オプションが異常です。');
  }

  // 実行
  for (var i = 0; i < _target.length; i++) {
    execute(_target[i]);
  }

  function execute(_target) {
    var isSuccess = false;
    var onPosition;

    setOnPoition();
    on();

    window.addEventListener('click', function() {
      console.log(onPosition);
    });

    var timer;
    window.addEventListener('resize', function() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        setOnPoition();
      }, 100);
    });

    function setOnPoition() {
      if (_options.offset.indexOf('%') != -1) {
        console.log(window.innerHeight);

        var par = parseInt(_options.offset.replace('%', ''));
        console.log(par);

        var offset = window.innerHeight * (par / 100);
        console.log(offset);

        onPosition = _target.getBoundingClientRect().top - window.innerHeight + offset;
      } else {
        onPosition = _target.getBoundingClientRect().top - window.innerHeight;
      }
    }

    window.addEventListener('scroll', function() {
      if (isSuccess) {
        return false;
      }
      on();
    });

    function on() {
      // 表示されたらcallbackを動かす
      if (onPosition < window.pageYOffset) {
        _options.callback(_target);
        isSuccess = true;
      }
    }
  }
}