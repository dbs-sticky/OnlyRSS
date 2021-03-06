# RSS for productivity

## What is RSS?

RSS (Really Simple Syndication) is a web feed that allows users and applications to access updates to websites in a standardized, computer-readable format. These feeds can, for example, allow a user to keep track of many (potentially, hundreds) different websites in a single news aggregator. Websites usually use RSS feeds to publish frequently updated information, such as blog entries, news headlines, or episodes of audio and video series. RSS is also used to distribute podcasts. An RSS document (usually called the "feed") includes full or summarized text, and metadata, like publishing date and author's name.

Below you can see an example of the contents of an RSS feed. It's simply a channel (this could be your favourite news or blog site), followed by a list of items (articles, podcasts, weather updates, search results etc.). Users of RSS never actually look at this feed, it's not meant for people, it's meant for machines, i.e the news aggregators.

    <channel>
    <title>OnlyRSS</title>
    <link>https://onlyrss.org</link>
    <description>The latest posts from OnlyRSS.org</description>
    <item>
        <title>It's Spring, what should you be doing in your garden?</title>
        <link>https://onlyrss.org/drawing-with-excalidraw</link>
        <description>Excalidraw is described by its creators as a "Virtual whiteboard for sketching hand-drawn like diagrams"....</description>
    </item>
    <item>
        <title>Weed control special</title>
        <link>https://onlyrss.org/working-from-home-hardware</link>
        <description>I recently wrote about my weekday lockdown routine. In this article I'll be describing the hardware I use to do my job while...</description>
    </item>
    </channel>

For example, here's how the example above would actually appear to me in my news aggregator.
![](images/rss-for-productivity-1.png)

## So what exactly is a News aggregator?

A News aggregator is simply a software application, some aggregators are desktops apps, but these days aggregators are mostly online applications. Feedly and Inoreader are two popular online versions and both have similar capabilities i.e. they allow you to search for, and then subscribe to, many different websites (mostly blogs and news sites, but also search results). Whenever new content is published, rather than visit 100 different websites, you simply open your News aggregator, and see the full list of content in a nice, easy to digest list. You can then mark as read, save for later, share, add notes etc.

## Why should I care?

If you ask people within any type of organisation how they analyse their data, you'll probably get an answer pretty quick, and that answer is likely to be Excel, Tableau, PowerBI, SQL, Python etc. But, ask them how they analyse the news, and you'll probably get a confused look. Most companies have a process in place for the aggregation, analysis, and dissemination of structured content (typically some form of data lake, analytics tool, and shared dashboards), but how many have a solution for the aggregation, analysis and sharing of unstructured content i.e. news. News is data, it's unstructured, but it's still data. More than **80 percent** of all data generated today is considered unstructured.

## Still not convinced? Let's try an example
