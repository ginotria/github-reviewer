$(function() {
    var userNames = [
        'CCRutaquio22',
        'cjadami',
        'brianpunzalan',
        'dianamayores',
        'mikelperalta',
        'JakeyPayat',
        'johnpatrickmostoles',
        'DanPiedad',
        'ChrissyOngy',
        'sunshine-eunice',
        'khulas18',
        'jm-abainza',
        'jabocruz',
        'keizelmalaluan',
        'jay120794',
        'kfc11',
        'joemscore27',
        'raphdumape',
        'francisestrada',
        'kennethbox32'

    ];
    function loadRepos(token, users, repoName) {
        var github = new Github({
          token: token,
          auth: "oauth"
        });
        users.forEach(function(user, index) {
            var repo = github.getRepo(user, repoName);
            repo.contents('master', "/", function(err, contents) {
                var $row = $('<tr>');
                var $utd = $('<td class="user-cell">');
                var itemCount = 0;
                var files = {};
                        var $ul = $('<a>').attr({
                            target: '_blank',
                            href: 'https://github.com/' + user
                        }).text(user);
                $row.append($utd.append($ul));
                $row.append($('<td>').text(index + 1));
                if (!err) {
                    var raw = JSON.parse(contents);
                    console.log(raw);
                    raw.forEach(function(f) {
                        files[f.name.toLowerCase()] = f;
                    });
                }

                function setTooltip($el, path) {
                        $el.qtip({
                            position: {
                                my: 'center right', // Position my top left...
                                at: 'center left',
                                target: $el,
                                viewport: $(window)
                            },
                            content: {
                                text: function(ev) {
                                    // $tooltip = $('<h3>' + fl.name + '</h3><pre class="prettyprint linenums"></pre>');
                                    $tooltip = $('<pre class="prettyprint linenums" style="font-size: 10px;">loading source code...</pre>');// + fl.name + '</h3><pre class="prettyprint linenums"></pre>');

                                    $tooltip.css('width', '590px');
                                    $tooltip.css({
                                        width: '590px',
                                        'font-size': '16px',
                                        'font-family': 'Courier New'
                                    });
                                    if (lscache.get(user + path)) {
                                        $tooltip.html(lscache.get(user + path));
                                        return $tooltip.addClass("prettyprint linenums");
                                    }
                                    repo.read('master', path, function(err, data) {
                                        // $tooltip.html(data.replace(/\n/g, '<br />').replace(/\t/g, ' '));
                                        lscache.set(user + path, data);
                                        $tooltip.html(data).addClass("prettyprint linenums");
                                    });

                                    return $tooltip.addClass("prettyprint linenums");
                                }
                            },
                            show: {
                                solo: true
                            },
                            hide: {
                                delay: 1000,
                                fixed: true
                            },
                            style: {
                            classes: 'ui-tooltip-light ui-tooltip-shadow'
                            }
                        });
                }
                for (var i = 1; i <= 10; i++) {
                    var filename =  'sw' + i + '.js';
                    var $td = $('<td>');
                    if (files[filename]) {
                        var fl = files[filename];
                        var $l = $('<a>').attr({
                            target: '_blank',
                            href: files[filename].html_url
                        }).text(filename);
                        $row.append($td.append($l));
                        setTooltip($td, fl.path);
                        itemCount++;
                    } else {
                        $row.append($td.css('background-color', '#7f8c8d'));
                    }
                }
                $row.append($('<td>').text(itemCount));
                $('tbody').append($row);
            });
        });
    }
    $('form').submit(function() {
        var val  = $('form').serializeObject();
        loadRepos(val.token, userNames, val.repo);
        return false;
    });
    loadRepos('f349ba32081e41829c876a934df276451441403b', userNames, 'coe-seatwork-four');
    lscache.flush();
    prettyPrint();
});