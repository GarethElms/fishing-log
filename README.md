Fishing-log
===========

I'm learning node.js at the moment so I'm chucking together a basic web app where you can add fish to a log. Not that I go fishing much. I'll split the app into versions based on what I'm learning.

Version 1
=========
There is a static index.html that contains a form where you can enter the fish type and weight. When you submit the form a new page is displayed showing the form values in json format. I used formidable to access the form values and util.inspect() to get the json. I also use the mime package to set the correct content-type header based on the extension of the file being served.

Version 2
=========
Now it uses jade templating rather than a static index.html. I serve static files if the requested url begins with /public/ and serve jade template results for any other file ie; index.jade (which is the default template in my code if the request url is /).

The most challenging part of version 2 was learning jade. I resisted jade at first because it seemed so unnatural but it's actually easy to use and understand once you get the hang of it.
