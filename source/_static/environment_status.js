  //State of data retrieval
  var STATE_NOTLOADED = 0;
  var STATE_LOADING = 1;
  var STATE_OK = 2;
  var STATE_ERROR = 3;
  
  //Status codes for service checks
  var STATUS_OK = 0;
  var STATUS_WARN = 1;
  var STATUS_ERROR = 2;
  
  // Allow up to five minutes difference in time stamps of content revied to
  // that of the client.
  var MAX_TIME_DELTA=1000*60*5; 
  
  //Sync should show something within last 30 minutes
  var MAX_TIME_SYNCLOG=1000*60*30; 

  //Index generator should show something within last 24 hours
  var MAX_TIME_INDEX_GEN_LOG=1000*60*60*24; 

  //Index processor should show something within last 24 hours
  var MAX_TIME_INDEX_PROC_LOG=1000*60*60*24; 

  var services = [ {
    id : 'd1-processing',
    name : 'D1-Processing',
    cpu_warn: 20
  }, {
    id : 'd1-index-task-generator',
    name : 'Index-Task-Generator',
    cpu_warn: 20
  }, {
    id : 'd1-index-task-processor',
    name : 'Index-Task-Processor',
    cpu_warn: 20
  }, {
    id : 'tomcat7',
    name : 'Tomcat',
    cpu_warn: 50    
  }, {
    id : 'zookeeper',
    name : 'Zookeeper',
    cpu_warn: 10
  }, {
    id : 'SLAPD',
    name : 'SLAPD',
    cpu_warn: 10
  }, {
    id : 'postgresql',
    name : 'Postgresql',
    cpu_warn: 10
  } ];

  var processing = [ {
    id : 'Replication.active',
    name : 'Replication',
    title : 'Value of replication.properties'
  }, {
    id : 'Synchronization.active',
    name : 'Synchronization',
    title : 'Value of synchronization.properties'
  }, {
    id : 'LogAggregator.active',
    name : 'Aggregation',
    title : 'Value of logAggregation.properties'
  } ];


  var indexing = [ {
      id : 'indexing.inprocess',
      name : 'Currently Indexing',
      title : 'Number of entries that currently being processed by indexing'
  }, {
      id : 'indexing.new',
      name : 'Awaiting Indexing',
      title : 'Number of entries that currently being processed by indexing'
  }, {
      id : 'indexing.failed',
      name : 'Failed Indexing',
      title : 'Number of entries that failed index processing'
  }];

  var certificates = [ {
    id : 'certificate.wildcard',
    name: 'wildcard',
    title: 'Server.* Cert.'
  },{
    id : 'certificate.client',
    name: 'client',
    title: 'Client Cert.'
  },{
    id : 'certificate.fqdn',
    name: 'server_fqdn',
    title: 'FQDN Cert.'
  }];
  
  
  //TODO: load the CNs from the node list at each environment.
  var environments = {
    'production' : {
      'name' : 'Production',
      'primary' : 'cn.dataone.org',
      'primary_ip': '',
      'log': [],
      'rendered': false,
      'cns' : {
        'cn-ucsb-1.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-unm-1.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-orc-1.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        }
      }
    },
    'stage' : {
      'name' : 'Stage',
      'primary' : 'cn-stage.test.dataone.org',
      'primary_ip': '',
      'log': [],
      'rendered': false,
      'cns' : {
        'cn-stage-ucsb-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-stage-orc-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-stage-unm-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        }
      }
    },
    'stage-2' : {
      'name' : 'Stage-2',
      'primary' : 'cn-stage-2.test.dataone.org',
      'primary_ip': '',
      'log': [],
      'rendered': false,
      'cns' : {
        'cn-stage-unm-2.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        }
      }
    },
    'sandbox' : {
      'name' : 'Sandbox',
      'primary' : 'cn-sandbox.test.dataone.org',
      'primary_ip': '',
      'log': [],
      'rendered': false,
      'cns' : {
        'cn-sandbox-ucsb-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-sandbox-orc-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-sandbox-unm-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        }
      }
    },
    'sandbox-2' : {
      'name' : 'Sandbox-2',
      'primary' : 'cn-sandbox-2.test.dataone.org',
      'primary_ip': '',
      'log': [],
      'rendered': false,
      'cns' : {
        'cn-sandbox-ucsb-2.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        }
      }
    },
    'dev' : {
      'name' : 'Dev',
      'primary' : 'cn-dev.test.dataone.org',
      'primary_ip': '',
      'log': [],
      'rendered': false,
      'cns' : {
        'cn-dev-ucsb-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-dev-orc-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-dev-unm-1.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        }
      }
    },
    'dev-2' : {
      'name' : 'Dev-2',
      'primary' : 'cn-dev-2.test.dataone.org',
      'primary_ip': '',
      'log': [],
      'rendered': false,
      'cns' : {
        'cn-dev-ucsb-2.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        },
        'cn-dev-unm-2.test.dataone.org' : {
          'state' : STATE_NOTLOADED,
          'stats' : {}
        }
      }
    }
  };

  var MAX_LOG_ENTRIES = 25;  //Max number of rows in each environment log
  var MAX_HISTORY = 15;  //Keep status of services around for a bit
  var service_history = {}; 
  
  /**
   * Peform a Network Service Lookup, using StatDNS API.
   *
   */
  function NSLookup(environment, dn) {
    var url = "https://examples.dataone.org/rrda/8.8.8.8:53/%FQDN%/a".replace(
        "%FQDN%", dn);
    var theResult = "";
    $.ajax({
      dataType : "json",
      url : url,
      async : true,
      success : function(response) {
        //console.log("nid = " + nid);
        //console.log(response)
        for (var i = 0; i < response.answer.length; i++) {
          if (response.answer[i]['type'] == 'A') {
            environments[environment]['primary_ip'] = response.answer[i]['rdata'];
            renderEnvironmentStatus(environment);
            break;
          }
        }
      }
    });
  }
  

function generateEnvironmentStatusView(target, env) {
  var t = $("#" + target);
  var mentries = [];
  mentries.push("<a href='#" + env + "' class='menu'>" + environments[env]['name'] + "</a>");
}

  
  function generateStatusView(target) {
    //Creates the DOM structure that will be used to hold results as they are 
    //pulled in from the servers.
    var t = $("#" + target);
    var mentries = [];
    var env;
    var id;
    var cn;
    var idx;
    for ( env in environments) {
      //Add menu entry
      mentries.push("<a href='#" + env + "' class='menu'>" + environments[env]['name'] + "</a>");
    }
    var m_entry = $("<div />", {'html':mentries.join("&nbsp;|&nbsp;"), 
                                'class':'twelve columns',
                                'style':'margin-bottom: 10px',
                                'id':'top'});
    $("#environment_links").append(m_entry);
    
    for ( env in environments) {
      //Container div, one per environment
      var od = $("<details />", {
        id : env,
        'open':'1'
      });
      var summary = $("<summary />", {
        id: "summary_" + env
      }).html(environments[env]['name']);
      //var head = $("<h3>").html();
      //summary.append(head);
      od.append(summary);
      var p = $("<p>",{text:'Primary IP: ', 'class':'info'});
      p.append($("<span>",{id:env+"~primary_ip", 'class':'ip_address'}));
      od.append(p);
      
      var cns = environments[env]['cns'];
      var tb = $("<table>");
      var cgroup = $("<colgroup>");
      var tr = $("<tr>");
      tr.append($("<th>", {
        text : 'Node'
      }));
      cgroup.append($("<col>",{id: env + "~col~labels"}));
      for (cn in environments[env]['cns']) {
        var name = cn.split('.')[0];
        tr.append($("<th>").html(name));
        cgroup.append($("<col>", {id: env + '~col~' + cn}));
      }
      tb.append(cgroup);
      tb.append(tr);
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "IP Address"
      }));
      for (cn in environments[env]['cns']) {
        id = env + "~" + cn + "~ipaddr";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);
      
      // Time display
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "Time",
        title : 'System time on node.'
      }));
      for (cn in environments[env]['cns']) {
        id = env + "~" + cn + "~timestamp";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);

      // Server Ping results
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "Ping",
        title : 'Result of calling /v2/monitor/ping'
      }));
      for ( cn in environments[env]['cns']) {
        id = env + "~" + cn + "~ping";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);

      // Server CLOSE_WAIT counts
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "CLOSE_WAIT",
        title : 'Number of CLOSE_WAIT states'
      }));
      for (cn in environments[env]['cns']) {
        id = env + "~" + cn + "~close_wait";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);

      // Server ESTABLISHED counts
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "ESTABLISHED",
        title : 'Number of ESTABLISHED states'
      }));
      for (cn in environments[env]['cns']) {
        id = env + "~" + cn + "~established";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);

      //Properties of processing enablement
      for (idx in processing) {
        tr = $("<tr>");
        tr.append($("<td>", {
          text : processing[idx]['name'],
          title : processing[idx]['title']
        }));
        for ( cn in environments[env]['cns']) {
          id = env + "~" + cn + "~" + processing[idx]['id'];
          tr.append($("<td>", {
            id : id,
            text : '.',
            'class' : 'data'
          }));
        }
        tb.append(tr);
      }

      //Log timestamps
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "Sync Log",
        title : 'Timestamp of last good log message. \n' +
                'egrep "INFO]\s(.*)V2TransferObjectTask:createObject" '  +
                '/var/log/dataone/synchronize/cn-synchronization.log'
      }));
      for ( cn in environments[env]['cns']) {
        id = env + "~" + cn + "~log-sync";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);      
      
      //Log timestamps
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "Index Generator Log",
        title : 'Timestamp of last good log message. \n' +
                'egrep "INFO](.*):entryUpdated\" ' +
                '/var/log/dataone/index/cn-index-generator-daemon.log'
      }));
      for ( cn in environments[env]['cns']) {
        id = env + "~" + cn + "~log-indexgenerator";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);      

      //Log timestamps
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "Index Processor Log",
        title : 'Timestamp of last good log message. \n' +
                'egrep "INFO](.*)Indexing complete for pid:\" ' +
                '/var/log/dataone/index/cn-index-processor-daemon.log'
      }));
      for ( cn in environments[env]['cns']) {
        id = env + "~" + cn + "~log-indexprocessor";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);      

      //Index processor task queue
      tr = $("<tr>");
      tr.append($("<td>", {
        text : "Index Processor Tasks",
        title: "Number of indexing tasks in different states"
      }));
      for ( cn in environments[env]['cns']) {
        id = env + "~" + cn + "~indextasks";
        tr.append($("<td>", {
          id : id,
          text : '.',
          'class' : 'data'
        }));
      }
      tb.append(tr);
      
      //Various services
      for ( var svc in services) {
        tr = $("<tr>");
        tr.append($("<td>", {
          text : services[svc]['name']
        }));
        for ( cn in environments[env]['cns']) {
          var v = ".";
          id = env + "~" + cn + "~" + services[svc]['id'];
          service_history[id] = {'cpu':[], 'mem':[]};
          var td = $("<td>", {
            id : id,
            'class' : 'data'
          });
          td.append($("<span>", {id: id+"~etime", text: '.'}));
          td.append($("<span>", {id: id+"~cpu", text: '', 'class':'data'}));
          td.append($("<span>", {id: id+"~mem", text: '', 'class':'data'}));
          tr.append(td);
        }
        tb.append(tr);
      }
      
      // Certificates used by the CNs
      for (idx in certificates) {
        tr = $("<tr>");
        tr.append($("<td>", {
          text : certificates[idx]['title']
        }));
        for ( cn in environments[env]['cns']) {
          id = env + "~" + cn + "~" + certificates[idx]['id'];
          tr.append($("<td>", {
            id : id,
            text : '.',
            'class' : 'data'
          }));
        }
        tb.append(tr)        
      }
      
      od.append(tb);
      // Create a log report place
      id = env + '~log';
      var logger = $("<div>").append( $("<pre>", {id:id, 'class':'logger', text:''}));
      od.append(logger);
      t.append(od);
    }
  }
  
  
  function renderLog(env) {
    var id = env + '~log';
    $('[id="' + id + '"]').text(environments[env]['log'].join("\n"));
  }
  
  
  function eLog(env, message, status) {
    var ts = new Date();
    var entry = ts.toISOString().split(".")[0];
    switch (status) {
      case STATUS_OK: 
        entry += " OK:";
        break;
      case STATUS_WARN: 
        entry += " WARN:";
        break;
      case STATUS_ERROR: 
        entry += " ERROR:";
        break;      
    }
    entry += " " + message;
    environments[env]['log'].unshift(entry);
    if (environments[env]['log'].length > MAX_LOG_ENTRIES) {
      environments[env]['log'].pop();
    }
  }
  
  
  function setIdStatus(id, status) {
    // Set display class of element id according to status
    if (status == STATUS_OK) {
      $('[id="' + id + '"]').removeClass('status_error');
      $('[id="' + id + '"]').removeClass('status_warn');
      $('[id="' + id + '"]').addClass('status_ok');
      return;
    }
    if (status == STATUS_ERROR) {
      $('[id="' + id + '"]').removeClass('status_ok');
      $('[id="' + id + '"]').removeClass('status_warn');
      $('[id="' + id + '"]').addClass('status_error');
      return;
    }
    if (status == STATUS_WARN) {
      $('[id="' + id + '"]').removeClass('status_ok');
      $('[id="' + id + '"]').removeClass('status_error');
      $('[id="' + id + '"]').addClass('status_warn');
      return;
    }
  }
  
  
  function getServiceInfoById(service) {
    for (var svc in services) {
      if (services[svc]['id'] == service) {
        return services[svc];
      }
    }
    return null;
  }
  
  
  function isPrimaryCN(env, cn) {
    //true if specified CN is the primary for environment
    return (environments[env]['cns'][cn]['stats']['ip_address'] == environments[env]['primary_ip']);
  }
  
  
  function isProcessEnabled(env, process) {
    // Return a dict of cn:bool
    var res = {'n': 0};
    var v = false;
    for ( var cn in environments[env]['cns'] ) {
      try {
        v = environments[env]['cns'][cn]['stats']['processing'][process];
      } catch (err) {
        v = false;
      }
      res[cn] = v;
      if ( v ) {
        res['n'] += 1;
      }
    }
    return res;
  }
  

  function isServiceRunningCN(env, service, cn) {
    try {
      return environments[env]['cns'][cn]['stats']['services'][service].length
    } catch (err) {
      console.log("Error checking service " + service + " on CN " + cn);
    }
    return 0;
  }
  
  
  function isServiceRunning(env, service) {
    // Return a dict of cn:bool
    var res = {'n': 0};
    for ( var cn in environments[env]['cns'] ) {
      res[cn] = false;
      var ninstances = isServiceRunningCN(env, service, cn);
      if (ninstances > 0) {
        res[cn] = true;
        res['n'] += 1;  
      }
    }
    return res;
  }
  
  
  function checkService(env, service, cn, overall) {
    var id = env + "~" + cn + "~" + service;
    var svc_info = getServiceInfoById(service);
    if (isServiceRunningCN(env, service, cn) > 0) {
      var load = parseFloat(environments[env]['cns'][cn]['stats']['services'][service][0][2]);
      if (load >= svc_info['cpu_warn']) {
        setIdStatus(id, STATUS_WARN);
        eLog(env, svc_info['name'] + " CPU use seems high (" + environments[env]['cns'][cn]['stats']['services'][service][0][2] + ") on " + cn, STATUS_WARN);
        overall[1] += 1;
      } else {
        setIdStatus(id, STATUS_OK);
        overall[0] += 1;
      }
    } else {
      setIdStatus(id, STATUS_ERROR);
      eLog(env, svc_info['name'] + " is not running on " + cn, STATUS_ERROR);
      overall[2] += 1;
    }
    return overall
  }
  
  
  function checkSyncLogTime(env, cn) {
    var id = env + "~" + cn + "~log-sync";
    var t0 = Date.parse(environments[env]['cns'][cn]['stats']['logs']['synchronization']);
    var t1 = environments[env]['cns'][cn]['ts_retrieved'];
    var delta = Math.abs(t1-t0);
    if ( delta > MAX_TIME_SYNCLOG ) {
      delta = delta / (1000 * 60.0);
      var msg = '';
      if (delta > 120) {
        delta = delta / 60;
        msg = Math.round(delta) + " hours";
        if (delta > 48) {
          msg = Math.round(delta/24) + " days";
        }
      } else {
        msg = Math.round(delta) + " minutes";
      }
      setIdStatus(id, STATUS_ERROR);
      eLog(env, "No new messages in sync log for " + msg);
    } else {
      setIdStatus(id, STATUS_OK);
    }
  }
  

  function checkIndexGeneratorLogTime(env, cn) {
    var id = env + "~" + cn + "~log-indexgenerator";
    var t0 = Date.parse(environments[env]['cns'][cn]['stats']['logs']['indexgenerator']);
    var t1 = environments[env]['cns'][cn]['ts_retrieved'];
    var delta = Math.abs(t1-t0);
    if ( delta > MAX_TIME_INDEX_GEN_LOG ) {
      delta = delta / (1000 * 60.0);
      var msg = '';
      if (delta > 120) {
        delta = delta / 60;
        msg = Math.round(delta) + " hours";
        if (delta > 48) {
          msg = Math.round(delta/24) + " days";
        }
      } else {
        msg = Math.round(delta) + " minutes";
      }
      setIdStatus(id, STATUS_ERROR);
      eLog(env, "No new messages in index generator log for " + msg);
    } else {
      setIdStatus(id, STATUS_OK);
    }
  }
  
  
  function checkIndexProcessorLogTime(env, cn) {
    var id = env + "~" + cn + "~log-indexprocessor";
    var t0 = Date.parse(environments[env]['cns'][cn]['stats']['logs']['indexprocessor']);
    var t1 = environments[env]['cns'][cn]['ts_retrieved'];
    var delta = Math.abs(t1-t0);
    if ( delta > MAX_TIME_INDEX_PROC_LOG ) {
      delta = delta / (1000 * 60.0);
      var msg = '';
      if (delta > 120) {
        delta = delta / 60;
        msg = Math.round(delta) + " hours";
        if (delta > 48) {
          msg = Math.round(delta/24) + " days";
        }
      } else {
        msg = Math.round(delta) + " minutes";
      }
      setIdStatus(id, STATUS_ERROR);
      eLog(env, "No new messages in index processor log for " + msg);
    } else {
      setIdStatus(id, STATUS_OK);
    }
  }
  
  
  function checkEnvironmentProcessing(env, overall) {
    // Check that processing is running on the primary CN and that
    // sync and replication are enabled and running on only one CN.
    var svc = 'd1-processing';
    var svc_running = isServiceRunning(env, svc);
    var sync_enabled = isProcessEnabled(env, 'Synchronization.active');
    var repl_enabled = isProcessEnabled(env, 'Replication.active');
    var idx_gen_running = isServiceRunning(env, "d1-index-task-generator");
    var idx_proc_running = isServiceRunning(env, "d1-index-task-processor");
    var id = '';
    var cn = '';
    for ( cn in environments[env]['cns']) {
      id = env + "~" + cn + "~" + svc;
      if ( idx_gen_running[cn] ) {
        checkIndexGeneratorLogTime(env, cn);
      }
      if ( idx_proc_running[cn] ) {
        checkIndexProcessorLogTime(env, cn);
      }
      if ( svc_running[cn] ) { //Service running on the CN
        if (sync_enabled[cn] && repl_enabled[cn]) { //With sync and replication enabled.
          if (svc_running['n'] > 1) {
            // It is an error to have processing running on more than one 
            // CN where sync and repl are enabled.
            setIdStatus(id, STATUS_ERROR);
            eLog(env,'d1-processing is running on more that one CN with synchronization and replication enabled' ,STATUS_ERROR);
          } else {
            setIdStatus(id, STATUS_OK);
            id = env + "~" + cn + "~" + 'Synchronization.active';
            setIdStatus(id, STATUS_OK);
            id = env + "~" + cn + "~" + 'Replication.active';
            setIdStatus(id, STATUS_OK);
            overall[0] += 1;            
            checkSyncLogTime(env, cn);
          }
        } else {
          if (!sync_enabled[cn]) {
            setIdStatus(id, STATUS_WARN);
            eLog(env,'d1-processing is running but synchronization is not enabled' ,STATUS_WARN);
            overall[1] += 1;
          } else if (!repl_enabled[cn]) {
            setIdStatus(id, STATUS_WARN);
            eLog(env,'d1-processing is running but replication is not enabled' ,STATUS_WARN);
            overall[1] += 1;            
          }
        }
      } else //Service not running on CN: 
        if (( svc_running['n'] == 0) && ( (sync_enabled[cn] || repl_enabled[cn]) )) {
          if ( isPrimaryCN(env, cn) ) {
            setIdStatus(id, STATUS_ERROR);
            eLog(env,'d1-processing is not running on the primary CN' ,STATUS_ERROR);
            overall[2] += 1;
          } else {
            setIdStatus(id, STATUS_WARN);
            eLog(env,'d1-processing is not running in this environment' ,STATUS_WARN);
            overall[1] += 1;
          }
        } else if (svc_running['n'] == 1) {
          //Service not running on CN, but only one instance runing elsewhere
          setIdStatus(id, STATUS_OK);
          overall[0] += 1;
        }
    }
    return overall;
  }
  

  function checkLogAggregation(env, overall) {
    //Must be running on one CN where agg is enabled and processing turned on.
    var id = '';
    var cn = '';
    var svc_running = isServiceRunning(env, 'd1-processing');
    var aggr_enabled = isProcessEnabled(env, 'LogAggregator.active');
    var both_running = {'n': 0};
    for (cn in environments[env]['cns']) {
      both_running[cn] = false;
      if ((svc_running[cn]) && (aggr_enabled[cn])) {
        both_running['n'] += 1;
        both_running[cn] = true;
      }
    }
    var err1_logged = false;
    var err2_logged = false;
    for ( cn in environments[env]['cns'] ) {
      id = env + "~" + cn + "~" + 'LogAggregator.active';
      if (aggr_enabled[cn]) {
        if (svc_running['n'] == 0) {
          setIdStatus(id, STATUS_ERROR);
          if (!err1_logged) {
            eLog(env,'Log aggregation is not running in this environment.' ,STATUS_ERROR);
            err1_logged = true;
            overall[2] += 1;
          }        
        } else if (svc_running[cn]) {
          if (both_running['n'] > 1) {
            setIdStatus(id, STATUS_ERROR);
            if (!err2_logged) {
              eLog(env,'Log aggregation is running on more than one CN in this environment' ,STATUS_ERROR);
              err2_logged = true;
              overall[2] += 1;
            }
          } else {
            setIdStatus(id, STATUS_OK);
            overall[0] += 1;
          }
        } 
      } 
    }
    return overall;
  }
  
  
  function checkIndexing(env, overall) {
    //Index generator and processor should be running on one CN
    //Does not matter if it is not the primary CN (Zookeeper keeps things
    //in sync across the CNs)
    var gen_running = isServiceRunning(env, 'd1-index-task-generator');
    var proc_running = isServiceRunning(env, 'd1-index-task-processor');
    var id = '';
    var cn = '';
    var err_logged = false;
    for ( cn in environments[env]['cns']) {
      if ((gen_running['n'] == 1) && (proc_running['n'] == 1)) {
        id = env + "~" + cn + "~" + 'd1-index-task-generator';
        setIdStatus(id, STATUS_OK);
        id = env + "~" + cn + "~" + 'd1-index-task-processor';
        setIdStatus(id, STATUS_OK);
        overall[0] += 1;
      } else if ((gen_running['n'] == 0) && (proc_running['n'] == 0)) {
        id = env + "~" + cn + "~" + 'd1-index-task-generator';
        setIdStatus(id, STATUS_ERROR);
        id = env + "~" + cn + "~" + 'd1-index-task-processor';
        setIdStatus(id, STATUS_ERROR);
        if (!err_logged) {
          eLog(env,'d1-index-task-generator and d1-index-task-processor are not running' ,STATUS_ERROR);
          err_logged = true;
          overall[2] += 1;
        }
      } else {
        id = env + "~" + cn + "~" + 'd1-index-task-generator';
        setIdStatus(id, STATUS_ERROR);
        id = env + "~" + cn + "~" + 'd1-index-task-processor';
        setIdStatus(id, STATUS_ERROR);
        if (!err_logged) {
          eLog(env,'Something is up with indexing, check index-task-processor and index-task-generator are running on the same host' ,STATUS_ERROR);
          err_logged = true;
          overall[2] += 1;
        }       
      }
    }
    return overall;
  }

  
  function checkReportingTime(env, overall) {
    for ( var cn in environments[env]['cns']) {
      var t0 = Date.parse(environments[env]['cns'][cn]['stats']['time_stamp']);
      var t1 = environments[env]['cns'][cn]['ts_retrieved'];
      var delta = Math.abs(t1-t0);
      var id = env + "~" + cn + "~timestamp";
      if ( delta > MAX_TIME_DELTA ) {
        delta = delta / (1000 * 60.0);
        var msg = '';
        if (delta > 120) {
          delta = delta / 60;
          msg = Math.round(delta) + " hours";
          if (delta > 48) {
            msg = Math.round(delta/24) + " days";
          }
        } else {
          msg = Math.round(delta) + " minutes";
        }
        setIdStatus(id, STATUS_ERROR);
        eLog(env, "No report from CN for " + msg);
        overall[2] += 1;
      } else {
        setIdStatus(id, STATUS_OK);
        overall[0] += 1;
      }
    }
    return overall;
  }
  
  function checkPing(env, overall) {
    for ( var cn in environments[env]['cns']) {
      var pingres = environments[env]['cns'][cn]['stats']['ping'];
      var id = env + "~" + cn + "~ping";
      msg = cn;
      if (pingres == 'FAIL') {
        setIdStatus(id, STATUS_ERROR);
        eLog(env, "Bad monitor/ping response for " + msg);
        overall[2] += 1;
      } else {
        setIdStatus(id, STATUS_OK);
        overall[0] += 1;
      }
    }
    return overall;
  }
  
  
  function checkCertificates(env, overall) {
    for ( var idx in certificates) {
      for ( var cn in environments[env]['cns']) {
        var id = env + "~" + cn + "~" + certificates[idx]['id'];
        var v = "";
        try {
          v = environments[env]['cns'][cn]['stats']['certificates'][certificates[idx]['name']];
          if (v['expired'] > 0) {
            setIdStatus(id, STATUS_ERROR);
            eLog(env, "Certificate " + v['file'] + " on " + cn + " expired.");
            overall[2] += 1;
          } else {
            setIdStatus(id, STATUS_OK);
            overall[0] += 1;
          }
        } catch (err) {
          console.log("Error getting cert for " + cn);
        }
      }
    }
    return overall;
  }
  
  
  function renderEnvironmentStatus(env) {
    //Renders the status data for the environment and computes if the
    //services running across the environment are as expected.
    
    //Check that status data for the environment is complete
    var cn;
    var idx;
    var v;
    var id;
    for ( cn in environments[env]['cns']) {
      if (environments[env]['cns'][cn]['state'] < STATE_OK) {
        return;
      }
    }
    if (environments[env]['primary_ip'] == '') {
      return;
    }
    if (environments[env]['rendered']) {
      return;
    }
    //eLog(env, "----", -1);
    //Output the status data to the view
    for ( cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~ipaddr";
      try {
        v = environments[env]['cns'][cn]['stats']['ip_address'];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    for (cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~timestamp";
      try {
        v = environments[env]['cns'][cn]['stats']['time_stamp'].split('.')[0];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    for (cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~ping";
      try {
        v = environments[env]['cns'][cn]['stats']['ping'];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    for (cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~close_wait";
      try {
        v = environments[env]['cns'][cn]['stats']['close_waits'];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    for ( cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~established";
      try {
        v = environments[env]['cns'][cn]['stats']['established'];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    //Log timestamps
    for ( cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~log-sync";
      try {
        v = environments[env]['cns'][cn]['stats']['logs']['synchronization'];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    for (cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~log-indexgenerator";
      try {
        v = environments[env]['cns'][cn]['stats']['logs']['indexgenerator'];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    for ( cn in environments[env]['cns']) {
      v = "-";
      id = env + "~" + cn + "~log-indexprocessor";
      try {
        v = environments[env]['cns'][cn]['stats']['logs']['indexprocessor'];
        $('[id="' + id + '"]').html(v);
      } catch (err) {
        console.log("Error getting stuff for " + cn);
      }
    }
    
    for ( idx in processing) {
      for ( cn in environments[env]['cns']) {
        id = env + "~" + cn + "~" + processing[idx]['id'];
        v = "N/A";
        try {
          v = environments[env]['cns'][cn]['stats']['processing'][processing[idx]['id']];
          if (v == true) {
            v = "Enabled";
          } else {
            v = "Disabled";
          }
          $('[id="' + id + '"]').html(v);
        } catch (err) {
          console.log("Error getting stuff for " + cn);
        }
      }
    }

    for ( idx in indexing ) {
      for (cn in environments[env]['cns']) {
        id = env + "~" + cn + "~indextasks";
        v = "";
        try {
          var entries = environments[env]['cns'][cn]['stats']['indexing']['queue']
          v = "<pre>";
          'NEW' in entries ? v += "NEW: " + entries['NEW'] + "\n" : void 0;
          'IN PROCESS' in entries ? v += "IN PROCESS: " + entries['IN PROCESS'] + "\n" : void 0;
          'FAILED' in entries ? v += "FAILED: " + entries['FAILED'] + "\n" : void 0;
          v += "</pre>";
          $('[id="' + id + '"]').html(v);
        }  catch (err) {
          console.log("Error getting stuff for " + cn);
        }
      }
    }

    for ( var svc in services) {
      for (cn in environments[env]['cns']) {
        v = "off";
        var title = "Service not running.";
        id = env + "~" + cn + "~" + services[svc]['id'];
        try {
          var data = environments[env]['cns'][cn]['stats']['services'][services[svc]['id']];
          if (data.length > 0) {
            service_history[id]['cpu'].push(data[0][2]);
            if (service_history[id]['cpu'].length > MAX_HISTORY) {
              service_history[id]['cpu'].shift();
            }
            service_history[id]['mem'].push(data[0][3]);
            if (service_history[id]['mem'].length > MAX_HISTORY) {
              service_history[id]['mem'].shift();
            }
            $('[id="' + id + '~etime"]').text(data[0][1]).prop('title', 'Elapsed time');
            $('[id="' + id + '~cpu"]').text(data[0][2]).prop('title', '%CPU');
            $('[id="' + id + '~mem"]').text(data[0][3]).prop('title', '%MEM');
          } else {
            $('[id="' + id + '~etime"]').text("Off").prop('title', 'Service not running');
          }
        } catch (err) {
          console.log("Error getting service " + svc + " stuff for " + cn);
        }
      }
    }

    for ( idx in certificates) {
      for ( cn in environments[env]['cns']) {
        id = env + "~" + cn + "~" + certificates[idx]['id'];
        v = "";
        try {
          v = environments[env]['cns'][cn]['stats']['certificates'][certificates[idx]['name']];
          $('[id="' + id + '"]').text(v['not_after']).prop('title', v['file']);;
        } catch (err) {
          console.log("Error getting cert for " + cn);
        }
      }
    }
    
    
    // Now compute if the service states are OK or if something unexepected is
    // going on
    var overall = [0,0,0]; // OK, WARN, ERROR
    if (environments[env]['primary_ip'] != '') {
      id = env+"~primary_ip";
      $('[id="' + id + '"]').text(environments[env]['primary_ip']);
      overall = checkReportingTime(env, overall);
      overall = checkPing(env, overall);
      for ( cn in environments[env]['cns']) {
        id = env + '~col~' + cn;
        var is_primary = false;
        if (environments[env]['cns'][cn]['stats']['ip_address'] == environments[env]['primary_ip']) {
          $('[id="' + id + '"]').addClass('is_primary');
          is_primary = true;
        } else {
          $('[id="' + id + '"]').removeClass('is_primary');          
        }
        overall = checkService(env, 'postgresql', cn, overall);
        overall = checkService(env, 'SLAPD', cn, overall);
        overall = checkService(env, 'tomcat7', cn, overall);
        overall = checkService(env, 'zookeeper', cn, overall);
      }
      overall = checkEnvironmentProcessing(env, overall);
      overall = checkLogAggregation(env, overall);
      overall = checkIndexing(env, overall);
      overall = checkCertificates(env, overall);
    }
    
    id = "summary_" + env;
    if (overall[2] > 0) {
      setIdStatus(id, STATUS_ERROR); 
    } else if (overall[1] > 0) {
      setIdStatus(id, STATUS_WARN);
    } else {
      setIdStatus(id, STATUS_OK);
      eLog(env, "", STATUS_OK);
    }
    renderLog(env);
    environments[env]['rendered'] = true;
  }

  function getCNStatusJSON(environment, cn) {
    //Load the service status for the cn
    var res = {};
    $.ajax({
      dataType : "json",
      //url: "/status/__ajaxproxy/https://" + cn + "/d1_service_status.json",
      url : "https://" + cn + "/d1_service_status.json",
      async : true,
      success : function(response) {
        response['error'] = "";
        environments[environment]['cns'][cn]['stats'] = response;
        environments[environment]['cns'][cn]['state'] = STATE_OK;
        environments[environment]['cns'][cn]['ts_retrieved'] = new Date();
        renderEnvironmentStatus(environment);
      },
      error : function(jqXHR, textStatus, errorThrown) {
        console.log("Unable to retrieve status for " + this.cn + "("
            + jqXHR.status + ")");
        environments[environment]['cns'][cn]['stats'] = {};
        environments[environment]['cns'][cn]['state'] = STATE_ERROR;
        environments[environment]['cns'][cn]['ts_retrieved'] = new Date();
        eLog(environment,'Failed to retrieve status update from '+ cn, STATUS_ERROR);
        renderEnvironmentStatus(environment);
      }
    });
  }

  function loadEnvironmentStatus(environment) {
    //Load status JSON from each CN of the environment and compute the
    //environment state.
    var cns = environments[environment];
    NSLookup(environment, environments[environment]['primary']);
    environments[environment]['rendered'] = false;
    for ( var cn in cns['cns']) {
      cns['cns'][cn]['state'] = STATE_LOADING;
      getCNStatusJSON(environment, cn);
    }
  }

  function reloadAllEnvironmentStatus() {
    //Refresh all the environments but pulling in the JSON status data
    //and recalculating the status
    //for ( var k in environments) {
    //  loadEnvironmentStatus(k);
    //}
    loadEnvironmentStatus(production);
    setTimeout(reloadAllEnvironmentStatus, 60 * 1000);
  }

  
