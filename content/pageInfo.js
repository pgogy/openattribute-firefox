/**
 * Create a panel for a tab at the top
 **/
{
    // Main outer panel
    const panel = document.createElement("vbox");
    panel.setAttribute("id","ccffextPanel");
    document.getElementById("mainDeck").appendChild(panel);
    
    // Horizontal box at the top
    const topLine = document.createElement("hbox");
    panel.appendChild(topLine);
    
    // Label showing the number of licensed objects
    const numberLabel = document.createElement("label");
    numberLabel.setAttribute("flex","1");
    topLine.appendChild(numberLabel);
    
    // Checkbox indicating whether to highlight licensed objects on page or not
    const highlightBox = document.createElement("checkbox");
    highlightBox.setAttribute("id","ccffext-highlight");
    highlightBox.setAttribute("label",ccffext.l10n.get("checkbox.highlight.label"));
    highlightBox.setAttribute("checked","true"); // By default, the objects are highlighted
    // topLine.appendChild(highlightBox);
    
    // List of licensed objects
    const list = document.createElement("vbox");
    list.setAttribute("id","ccffext-objects");
    list.setAttribute("flex","1");
    panel.appendChild(list);
    
    // List of added items
    var items = [];
}

/**
 * Add a tab at the top
 **/
{
    const tab = document.createElement("radio");
    
    with (tab)
    {
	setAttribute("id","ccffext-tab");
	setAttribute("label",ccffext.l10n.get("tab.title.label"));
	setAttribute("accesskey",ccffext.l10n.get("tab.title.key"));
	
	addEventListener("command",function() {

	    const doc = window.opener.content.document;
	    const objects = ccffext.objects.getLicensedSubjects(
		doc.location.href);

	    // Update the label showing the number of objects
	    numberLabel.setAttribute("value",
				     ccffext.l10n.get("label.number.label",objects.length));
	    
	    // Remove all previously added items from the list
	    for (let i = 0; i < items.length; ++i)
	    {
		list.removeChild(items[i]);
	    }
	    
	    items = [];
	    
	    var convertStrings = function(strings,part)
	    {
		var converted = [];
		
		for (let i = 0; i < strings.length; ++i)
		{
		    let name = strings[i].toLowerCase().replace(/[^a-z]/g,"");
		    converted.push(ccffext.l10n.get("object.license." + part + "." + name + ".label"));
		}
		
		var line = converted.join(", ");
		return line.substring(0,1).toUpperCase() + line.substring(1);
	    }
	    
	    // Add new items to the list
	    for (let i = 0; i < objects.length; ++i)
	    {
		const item = document.createElement("hbox");
		item.setAttribute("class","item");
		items.push(item);
		list.appendChild(item);
		
		const leftPanel = document.createElement("vbox");
		leftPanel.setAttribute("class","primary");
		leftPanel.setAttribute("flex","1");
		item.appendChild(leftPanel);
		
		const title = document.createElement("label");
		title.setAttribute("class","title");
		title.setAttribute("value",ccffext.objects.getDisplayTitle(
		    doc.location.href, objects[i]));
		leftPanel.appendChild(title);
		
		const sourceLine = document.createElement("hbox");
		sourceLine.setAttribute("class","line primary");
		leftPanel.appendChild(sourceLine);
		
		const sourceTitle = document.createElement("label");
		sourceTitle.setAttribute("class","line-title");
		sourceTitle.setAttribute("value",ccffext.l10n.get("object.source.title.label"));
		sourceLine.appendChild(sourceTitle);
		
		var source = ccffext.objects.getSource(
		    doc.location.href, objects[i]);
		const sourceValue = document.createElement("label");
		sourceValue.setAttribute("class","anchor");
		sourceValue.setAttribute("value",source);
		sourceValue.setAttribute("uri",source);
		sourceValue.addEventListener("click",function() {
		    window.open(this.getAttribute("uri"));
		},true);
		sourceLine.appendChild(sourceValue);
		
		var type = ccffext.objects.getType(
		    doc.location.href, objects[i]);
		if ("undefined" != typeof type)
		{
		    const typeLine = document.createElement("hbox");
		    typeLine.setAttribute("class","line");
		    leftPanel.appendChild(typeLine);
		    
		    const typeTitle = document.createElement("label");
		    typeTitle.setAttribute("class","line-title");
		    typeTitle.setAttribute("value",ccffext.l10n.get("object.type.title.label"));
		    typeLine.appendChild(typeTitle);
		    
		    const typeValue = document.createElement("label");
		    var line = ccffext.l10n.get("object.type."
						+ type.toLowerCase().replace(/[^a-z]/g,"") + ".label");
		    typeValue.setAttribute("value",line.substring(0,1).toUpperCase() + line.substring(1));
		    typeLine.appendChild(typeValue);
		}
		
		var author = ccffext.objects.getAuthor(
		    doc.location.href, objects[i]);
		var authorUri = ccffext.objects.getAuthorUri(
		    doc.location.href, objects[i]);
		if ("undefined" != typeof author)
		{
		    const authorLine = document.createElement("hbox");
		    authorLine.setAttribute("class","line");
		    leftPanel.appendChild(authorLine);
		    
		    const authorTitle = document.createElement("label");
		    authorTitle.setAttribute("class","line-title");
		    authorTitle.setAttribute("value",ccffext.l10n.get("object.author.title.label"));
		    authorLine.appendChild(authorTitle);
		    
		    const authorValue = document.createElement("label");
		    authorValue.setAttribute("value",author);
		    authorLine.appendChild(authorValue);
		    
			//
			// This fixes a bug when the author URI is actually undefined (Flickr Pages)
			//
			
		    if (undefined != authorUri)
		    {
			authorValue.setAttribute("class","anchor");
			authorValue.setAttribute("uri",authorUri.uri);
			authorValue.addEventListener("click",function(event) {
			    window.open(this.getAttribute("uri"));
			},true);
		    }
		}
		
		const licenseLine = document.createElement("hbox");
		licenseLine.setAttribute("class","line primary");
		leftPanel.appendChild(licenseLine);
		
		const licenseTitle = document.createElement("label");
		licenseTitle.setAttribute("class","line-title");
		licenseTitle.setAttribute("value",ccffext.l10n.get("object.license.title.label"));
		licenseLine.appendChild(licenseTitle);
		
		var licenseValue = document.createElement("label");
		licenseValue.setAttribute("class","anchor");
		licenseValue.addEventListener("click",function(event) {
		    window.open(this.getAttribute("uri"));
		},true);
		licenseLine.appendChild(licenseValue);
				
		const attribLine = document.createElement("vbox");
		attribLine.setAttribute("class","line primary");
		leftPanel.appendChild(attribLine);

		const attribTitleContainer = document.createElement("hbox");
		attribTitleContainer.setAttribute("class", "aligncenter");
		attribLine.appendChild(attribTitleContainer);

		const attribTitle = document.createElement("label");
		attribTitle.setAttribute("class","line-title");
		attribTitle.setAttribute("value",
					 ccffext.l10n.get("object.attribution.label"));
		attribTitleContainer.appendChild(attribTitle);
		
		const attribFormat = document.createElement("menulist");
		const attribFormatMenu = document.createElement("menupopup");
		const attribFormatHtml = document.createElement("menuitem");
		attribFormatHtml.setAttribute("label", "HTML");
		attribFormatHtml.setAttribute("value", "html");
		attribFormatMenu.appendChild(attribFormatHtml);

		const attribFormatText = document.createElement("menuitem");
		attribFormatText.setAttribute("label", "Plain Text");
		attribFormatText.setAttribute("value", "text");
		attribFormatMenu.appendChild(attribFormatText);

		attribFormat.appendChild(attribFormatMenu);

		attribTitleContainer.appendChild(attribFormat);

		const attribContainer = document.createElement("hbox");
		attribContainer.setAttribute("class", "indented");
		attribContainer.setAttribute("align", "start");
		attribLine.appendChild(attribContainer);
		
		var attribText = document.createElement("textbox");
		attribText.setAttribute("flex","1");
		attribText.setAttribute("multiline", "true");
		attribText.setAttribute("readonly", "true");
		attribText.addEventListener("focus", function(e) {
		    e.currentTarget.select();
		}, true);
		attribContainer.appendChild(attribText);

		function formatListener(textbox, doc_uri, object) {
		    function onSelect(e) {
			switch (e.currentTarget.selectedItem.value) {
			case "html":
			    textbox.setAttribute(
				"value", 
				ccffext.objects.getAttributionHtml(
				    doc_uri, object));
			    break;
			case "text":
			    textbox.setAttribute(
				"value", 
				ccffext.objects.getAttributionText(
				    doc_uri, object));
			    break;
			}
		    }
		  
		    return onSelect;
		}

		attribFormat.addEventListener(
		    "select", 
		    formatListener(attribText, doc.location.href, objects[i]), 
		    true);

		licenses.getLicenseInfo(
		    ccffext.objects.getLicense(doc.location.href,
					       objects[i]).uri,
		    function(license, args) {
			args[0].setAttribute("value",license.name);
			args[0].setAttribute("uri",license.uri);
			args[1].setAttribute(
			    "value", 
			    ccffext.objects.getAttributionHtml(args[2], args[3]));
		    }, [licenseValue, attribText, doc.location.href, 
			objects[i]]);

		const attribCopyButton = document.createElement("button");
		attribCopyButton.setAttribute("label",
					      ccffext.l10n.get("copy"));
		attribCopyButton.setAttribute("accesskey",
					      ccffext.l10n.get("object.button.attributionashtml.key"));
		attribCopyButton.addEventListener(
		    "click",
		    function(textbox) {
			function clickHandler(event) {
			    const clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
				getService(Components.interfaces.nsIClipboardHelper);
			    clipboard.copyString(textbox.getAttribute("value"));
			}
			return clickHandler;
		    }(attribText), true);
		
		attribContainer.appendChild(attribCopyButton);
		
		const nonRDFAattribLine = document.createElement("vbox");
		nonRDFAattribLine.setAttribute("class","line primary");
		leftPanel.appendChild(nonRDFAattribLine);

		const nonRDFAattribTitle = document.createElement("label");
		nonRDFAattribTitle.setAttribute("class","line-title");
		nonRDFAattribTitle.setAttribute("value",
					 ccffext.l10n.get("object.attribution.labelplain"));
		attribLine.appendChild(nonRDFAattribTitle);
		
		const nonRDFAattribContainer = document.createElement("hbox");
		nonRDFAattribContainer.setAttribute("class", "indented");
		nonRDFAattribLine.appendChild(nonRDFAattribContainer);
		
		var nonRDFAattribText = document.createElement("textbox");
		nonRDFAattribText.setAttribute("flex","1");
		nonRDFAattribText.setAttribute("multiline", "true");
		
		string = "Title : \"" + title.getAttribute("value"); 
		if (undefined != author) {
		
			string += "\" by " + author + "\n";
		
		}else{
		
			string += "\"\n";
			
		}
		string += "URL : " + doc.location.href + "\n";
		string += "License : " + licenseValue.getAttribute("uri") + " " + licenseValue.getAttribute("value");
		
		nonRDFAattribText.setAttribute("value",string);
		nonRDFAattribText.addEventListener("focus", function(e) {
		    nonRDFAattribText.select();
		}, true);
		nonRDFAattribContainer.appendChild(nonRDFAattribText);

		const nonRDFAattribCopyButton = document.createElement("button");
		nonRDFAattribCopyButton.setAttribute("label",
					      ccffext.l10n.get("copy"));
		nonRDFAattribCopyButton.setAttribute("accesskey",
					      ccffext.l10n.get("object.button.attributionashtml.key"));
		nonRDFAattribCopyButton.addEventListener("click",function() {
		    const clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
			getService(Components.interfaces.nsIClipboardHelper);
		    clipboard.copyString(nonRDFAattribText.getAttribute("value"));
		},true);
		
		nonRDFAattribContainer.appendChild(nonRDFAattribCopyButton);
		
		
	    }
	    
	    // Eventually switch to the tab
	    showTab('ccffext'); // Activates a panel with the "ccffextPanel" id
	},true);
    }
    
    document.getElementById("viewGroup").appendChild(tab);
}

alert("ageinfo")
