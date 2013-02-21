Fishing-log
===========

I'm learning node.js at the moment so I'm chucking together a basic web app where you can add fish to a log. Not that I go fishing much. I'll split the app into versions based on what I'm learning.

Version 1
---------
There is a static index.html that contains a form where you can enter the fish type and weight. When you submit the form a new page is displayed showing the form values in json format. I used formidable to access the form values and util.inspect() to get the json. I also use the mime package to set the correct content-type header based on the extension of the file being served.

Version 2
---------
Now it uses jade templating rather than a static index.html. I serve static files if the requested url begins with /public/ and serve jade template results for any other file ie; index.jade (which is the default template in my code if the request url is /).

The most challenging part of version 2 was learning jade. I resisted jade at first because it seemed so unnatural but it's actually easy to use and understand once you get the hang of it.

Version 3
---------
* Uses Jade layout. You need to pass the filename into jade.compile() so it knows where to start finding subviews and layouts in the file system
* Display a list of fish in a table
* Submitting the fish form will add the new fish to the list and keep the submitted values in the form on refresh
* When you submit the form the server issues a redirect get
* Sometimes jade and node errors are unhelpful
* Request exceptions bring down the entire node server. There must be a way of handling this I'll get to that part in the book I'm reading no doubt
