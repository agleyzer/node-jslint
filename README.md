node-jslint
===========

Easily use [jslint][] from the command line. Pass it the JS file you'd like to lint. For example:

    jslint foo.js

It assumes [nodejs][] globals and tolerates shebangs. Alternative JSLINT configuration 
may be passed in a JSON-formatted file via --config=FILE option, or by placing it in
 ~/.jslint.

Sample ~/.jslint that seems to work well for node.js:

    {
       "predef":   [ 
           "exports",
           "global",
           "process",
           "require",
           "__filename",
           "__dirname",
           "module"       
       ],
       "browser" : false,
       "devel" : false,
       "rhino" : false,
       "es5" : false, 
       "undef" : true,
       "widget": false,
       "windows" : false,
       "onvar" : true
    }

Installation
------------

You'll need [nodejs][] and [npm][], which is easy to install on OS X with [homebrew][]:

    curl -L http://github.com/mxcl/homebrew/tarball/master | tar xz --strip 1 -C /usr/local
    brew install npm

Then install:

    npm install http://github.com/reid/node-jslint/tarball/master

You may also clone this repository then install in your working copy:

    npm install .

This package isn't yet in the npm registry. I'm working on it.

Emacs
-----

Emacs integration is roughly based on <http://www.emacswiki.org/cgi-bin/wiki/FlymakeJavaScript>

For compiler integration, add the following code to your .emacs

    ;; compilation regexp for jslint
    (setq compilation-error-regexp-alist
      (cons '("^[ \t]*\\([A-Za-z.0-9_: \\-]+\\)(\\([0-9]+\\)[,]\\( *[0-9]+\\)) JSLINT: \\(.+\\)$" 1 2 3)
       compilation-error-regexp-alist))

Here's an example how to call compile with jslint when F2 is pressed:

    (define-key global-map [f2]
      (lambda ()
        (interactive)
        (progn
          (save-buffer)
          (compile
           (concat
    	(cond
    	 ((string= "scala" (file-name-extension (buffer-file-name))) "fsc")
    	 ((string= "py" (file-name-extension (buffer-file-name))) "python")
    	 ((string= "groovy" (file-name-extension (buffer-file-name))) "groovy")
    	 ((string= "js" (file-name-extension (buffer-file-name))) "jslint")
    	 (t "echo no compiler for "))
    	" \"" (buffer-file-name) "\"")))))

To use jslint with flymake, copy emacs/flymake-jslint-local.el into your emacs scripts directory, and add the fragment below to your .emacs:

    (require 'flymake-jslint-local)

    ;; interation with espresso mode
    (add-hook 'espresso-mode-hook
      (lambda () (flymake-mode t)))


License
-------

You can modify, copy and redistribute this software under the WTFPL, Version 2.
See <http://sam.zoy.org/wtfpl/COPYING> for details.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[jslint]: http://jslint.com/
[nodejs]: http://nodejs.org/
[npm]: http://github.com/isaacs/npm
[homebrew]: http://github.com/mxcl/homebrew
