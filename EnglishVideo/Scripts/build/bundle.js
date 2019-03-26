/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "91b2303eef80287f53cc";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./Scripts/myscripts/games/index.js")(__webpack_require__.s = "./Scripts/myscripts/games/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Scripts/myscripts/games/AjaxRequest.js":
/*!************************************************!*\
  !*** ./Scripts/myscripts/games/AjaxRequest.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return AjaxRequest; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar AjaxRequest =\n/*#__PURE__*/\nfunction () {\n  function AjaxRequest(url, method) {\n    _classCallCheck(this, AjaxRequest);\n\n    this.url = url;\n    this.method = method;\n  }\n\n  _createClass(AjaxRequest, [{\n    key: \"getJson\",\n    value: function getJson() {\n      return fetch(this.url, {\n        method: this.method\n      }).then(function (response) {\n        return response.json();\n      }).catch(function (error) {\n        console.log(\"Ошибка обращения к серверу \" + error.message);\n      });\n    }\n  }]);\n\n  return AjaxRequest;\n}();\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/AjaxRequest.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/Context.js":
/*!********************************************!*\
  !*** ./Scripts/myscripts/games/Context.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Context; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Context =\n/*#__PURE__*/\nfunction () {\n  function Context() {\n    _classCallCheck(this, Context);\n\n    this.game = null;\n  }\n\n  _createClass(Context, [{\n    key: \"setGame\",\n    value: function setGame(game) {\n      this.game = game;\n    }\n  }, {\n    key: \"startGame\",\n    value: function startGame() {\n      var _this = this;\n\n      document.getElementById('button-start-game').addEventListener('click', function () {\n        document.getElementsByClassName('window-start-game')[0].style.display = 'none';\n        setTimeout(function () {\n          document.getElementsByClassName('body-game')[0].style.display = 'flex';\n\n          _this.game.start();\n        }, 1000);\n      });\n    }\n  }]);\n\n  return Context;\n}(); //export default Context;\n\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/Context.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/Game.js":
/*!*****************************************!*\
  !*** ./Scripts/myscripts/games/Game.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Game; });\n/* harmony import */ var _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AjaxRequest */ \"./Scripts/myscripts/games/AjaxRequest.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Game =\n/*#__PURE__*/\nfunction () {\n  function Game() {\n    _classCallCheck(this, Game);\n\n    this.points = 0;\n    this.time = 15;\n    this.dictionary = null;\n    this.lenghtDictionary = 0;\n  }\n\n  _createClass(Game, [{\n    key: \"start\",\n    value: function start() {\n      console.log('Начало игры(родительский класс)');\n    }\n  }, {\n    key: \"setDictionary\",\n    value: function setDictionary(dictionary) {\n      this.dictionary = dictionary;\n      this.lenghtDictionary = dictionary.length;\n    } //---------Определение текущего пользователя------------\n\n  }, {\n    key: \"getUserLogin\",\n    value: function getUserLogin() {\n      var url = \"\".concat(document.location.origin, \"/Account/CurrentUser\");\n      var method = 'Get';\n      var conn = new _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__[\"default\"](url, method);\n      return conn.getJson().then(function (response) {\n        return response.UserLogin;\n      });\n    } //-------Получение словаря пользователя---------\n\n  }, {\n    key: \"getWordsFromDictionary\",\n    value: function getWordsFromDictionary() {\n      var user = this.getUserLogin();\n      return user.then(function (login) {\n        var url = \"\".concat(document.location.origin, \"/Games/GetExpressionTranslator?userName=\").concat(login);\n        var method = 'Get';\n        var conn = new _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__[\"default\"](url, method);\n        return conn.getJson();\n      });\n    } //-------Проверка словаря----------\n\n  }, {\n    key: \"validation\",\n    value: function validation() {\n      console.log('валидация');\n\n      if (this.lengthDictionary === 0) {\n        this.message(\"Недостаточно слов в словаре\");\n        console.log(\"Недостаточно слов в словаре\");\n        return false;\n      }\n\n      return true;\n    } //-------Получить очки-----\n\n  }, {\n    key: \"getPoints\",\n    value: function getPoints() {\n      // return document.getElementById('points').innerText;\n      return this.points;\n    } //------Увеличить очки-----\n\n  }, {\n    key: \"upPoints\",\n    value: function upPoints() {\n      var points = document.getElementById('points').innerText;\n      this.points = this.points + 1;\n      console.log(\"\\u041F\\u043E\\u0432\\u044B\\u0448\\u0435\\u043D\\u0438\\u0435 \\u0431\\u0430\\u043B\\u043B\\u043E\\u0432 \".concat(this.points));\n      document.getElementById('points').innerText = this.points;\n    } //------Уменьшить очки------\n\n  }, {\n    key: \"downPoints\",\n    value: function downPoints() {\n      var points = document.getElementById('points').innerText;\n      this.points = this.points - 1;\n      document.getElementById('points').innerText = this.points;\n    } //-----Конец игры-------\n\n  }, {\n    key: \"endGame\",\n    value: function endGame() {\n      document.getElementsByClassName('body-game')[0].style.display = 'none';\n      var endDOM = document.getElementById('end-game');\n      endDOM.style.display = 'flex';\n      endDOM.innerHTML = \"<div class='end-game-content'>\\u0418\\u0433\\u0440\\u0430 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0435\\u043D\\u0430. <br> <span class=\\\"result-game-points\\\">\\u0423 \\u0432\\u0430\\u0441 \".concat(this.getPoints(), \" \\u0431\\u0430\\u043B\\u043B\\u0430</span><div>\");\n      var buttons = document.createElement('div');\n      buttons.className = 'button-end-options';\n      var reset = document.createElement('button');\n      reset.className = 'button-end';\n      reset.appendChild(document.createTextNode('Старт'));\n\n      reset.onclick = function () {\n        document.getElementById('button-start-game').click();\n        document.getElementsByClassName('body-game')[0].style.display = 'flex';\n        endDOM.style.display = 'none';\n      };\n\n      var redirect = document.createElement('button');\n      redirect.className = 'button-end';\n      redirect.appendChild(document.createTextNode('Выход'));\n\n      redirect.onclick = function () {\n        document.location = document.location.origin + '/Games';\n      };\n\n      buttons.appendChild(reset);\n      buttons.appendChild(redirect);\n      document.getElementsByClassName('end-game-content')[0].appendChild(buttons);\n    }\n  }, {\n    key: \"message\",\n    value: function message(text) {\n      document.getElementsByClassName('body-game')[0].style.display = 'none';\n      var endDOM = document.getElementById('message-game');\n      endDOM.style.display = 'flex';\n      endDOM.innerHTML = \"<div class='end-game-content'><span class=\\\"result-game-points\\\"> \".concat(text, \"</span><div>\");\n    }\n  }]);\n\n  return Game;\n}(); //export default Game;\n\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/Game.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/GameAudioTranslation.js":
/*!*********************************************************!*\
  !*** ./Scripts/myscripts/games/GameAudioTranslation.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return AudioTranslationGame; });\n/* harmony import */ var _OxfordApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OxfordApi */ \"./Scripts/myscripts/games/OxfordApi.js\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Game */ \"./Scripts/myscripts/games/Game.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _get(target, property, receiver) { if (typeof Reflect !== \"undefined\" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }\n\nfunction _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\nvar AudioTranslationGame =\n/*#__PURE__*/\nfunction (_Game) {\n  _inherits(AudioTranslationGame, _Game);\n\n  function AudioTranslationGame() {\n    var _this;\n\n    _classCallCheck(this, AudioTranslationGame);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(AudioTranslationGame).call(this));\n    _this.currentInterval = null;\n    return _this;\n  }\n\n  _createClass(AudioTranslationGame, [{\n    key: \"start\",\n    value: function start() {\n      var _this2 = this;\n\n      _get(_getPrototypeOf(AudioTranslationGame.prototype), \"start\", this).call(this);\n\n      console.log(\"Начало игры\");\n      var connDictionary = this.getWordsFromDictionary();\n      connDictionary.then(function (dictionary) {\n        if (dictionary) dictionary.sort(function () {\n          return Math.random() - 0.5;\n        });\n\n        _this2.setDictionary(dictionary);\n\n        if (!_this2.validation()) return;\n\n        _this2.stepWithInterval(_this2.lenghtDictionary - 1);\n      }).catch(function (error) {\n        return console.log(\" \\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u043E\\u0442\\u0440\\u0438\\u0441\\u043E\\u0432\\u043A\\u0438 \\u0438\\u0433\\u0440\\u044B \".concat(error));\n      });\n    } //-------Установка аудио в DOM----------\n\n  }, {\n    key: \"setAudioDOM\",\n    value: function setAudioDOM(audio) {\n      var audioDOM = document.getElementById('audio-eng');\n      audioDOM.src = audio;\n      audioDOM.play();\n    } //-----Инициализация таймера-----\n\n  }, {\n    key: \"setTimerDOM\",\n    value: function setTimerDOM() {\n      var timerInDOM = document.getElementById('timer');\n      timerInDOM.innerText = this.time;\n      timerInDOM.className = '';\n    } //-------Работа таймера и проверка ответа(замыкание)-------\n\n  }, {\n    key: \"timer\",\n    value: function timer(i) {\n      var _this3 = this;\n\n      var word = this.dictionary[i].English;\n      var time = this.time;\n      var timerInDOM = document.getElementById('timer');\n      var inputDOM = document.getElementById('user-input');\n      this.setTimerDOM();\n      var currentInterval = setInterval(function () {\n        time--;\n        timerInDOM.innerText = time;\n\n        if (time == 3) {\n          timerInDOM.className = 'red-text';\n        }\n\n        if (time <= 0) {\n          _this3.downPoints();\n\n          clearInterval(currentInterval);\n\n          _this3.stepWithInterval(i - 1);\n\n          return;\n        }\n\n        inputDOM.addEventListener('keyup', function () {\n          if (word.toLowerCase() == inputDOM.value.toLowerCase()) {\n            _this3.upPoints();\n\n            clearInterval(currentInterval);\n\n            _this3.stepWithInterval(i - 1);\n\n            return;\n          }\n        });\n      }, 1000);\n    } //----------Шаг игры--------\n\n  }, {\n    key: \"stepWithInterval\",\n    value: function stepWithInterval(i) {\n      var _this4 = this;\n\n      document.getElementById('user-input').value = '';\n\n      if (i >= 0) {\n        var word = this.dictionary[i].English;\n        var connOxford = new _OxfordApi__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        connOxford.getAudioExemple(word).then(function (audio) {\n          if (!audio) {\n            console.log('аудио пропущено');\n\n            _this4.stepWithInterval(i - 1);\n\n            return;\n          }\n\n          _this4.setAudioDOM(audio);\n\n          _this4.timer(i, word);\n        });\n      } else {\n        this.endGame();\n      }\n    }\n  }]);\n\n  return AudioTranslationGame;\n}(_Game__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/GameAudioTranslation.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/GameDragAndDrop.js":
/*!****************************************************!*\
  !*** ./Scripts/myscripts/games/GameDragAndDrop.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return DragAndDropGame; });\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ \"./Scripts/myscripts/games/Game.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\nvar DragAndDropGame =\n/*#__PURE__*/\nfunction (_Game) {\n  _inherits(DragAndDropGame, _Game);\n\n  function DragAndDropGame() {\n    _classCallCheck(this, DragAndDropGame);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropGame).call(this));\n  }\n\n  _createClass(DragAndDropGame, [{\n    key: \"start\",\n    value: function start() {\n      var _this = this;\n\n      console.log(\"Начало игры\");\n      var connDictionary = this.getWordsFromDictionary();\n      connDictionary.then(function (dictionary) {\n        _this.setDictionary(dictionary);\n\n        if (!_this.validation()) return;\n\n        _this.createKonva();\n      }).catch(function (error) {\n        return console.log(\" \\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u043E\\u0442\\u0440\\u0438\\u0441\\u043E\\u0432\\u043A\\u0438 \\u0438\\u0433\\u0440\\u044B \".concat(error));\n      });\n    } //--------Отрисовка прямоугольника с текстом-----------\n\n  }, {\n    key: \"drawRectangle\",\n    value: function drawRectangle(stage, layer, id, word) {\n      var color = ['#c68724', '#4cff00', '#165ca3', '#c822bc', '#808080'];\n      var valueRandomColor = Math.floor(Math.random() * color.length);\n      var textOfWord = new Konva.Text({\n        text: word,\n        fontSize: 18,\n        fontFamily: 'Calibri',\n        fill: '#fff',\n        padding: 20,\n        align: 'center'\n      });\n      var rect = new Konva.Rect({\n        stroke: '#dcdcdc',\n        strokeWidth: 1,\n        fill: color[valueRandomColor],\n        width: textOfWord.getWidth(),\n        height: textOfWord.getHeight(),\n        shadowColor: 'black',\n        shadowBlur: 10,\n        shadowOffset: [10, 10],\n        shadowOpacity: 0.1,\n        cornerRadius: 15\n      }); //определение положения фигуры\n\n      var x = Math.floor(Math.random() * (stage.width() - rect.getWidth()));\n      var y = Math.floor(Math.random() * (stage.height() - rect.getHeight()));\n      var pos = {\n        x: x,\n        y: y\n      };\n      var group = new Konva.Group({\n        x: x,\n        y: y,\n        draggable: true,\n        name: id.toString()\n      });\n      group.add(rect, textOfWord);\n      return group;\n    }\n  }, {\n    key: \"drawDictionary\",\n    value: function drawDictionary(stage, layer) {\n      var _this2 = this;\n\n      var dictionary = this.dictionary;\n      dictionary.forEach(function (objectWord) {\n        var eng = objectWord.English;\n        var rus = objectWord.Russia;\n        var id = objectWord.Id;\n        console.log(eng + \" \" + rus);\n\n        var rectangleEng = _this2.drawRectangle(stage, layer, id, eng);\n\n        var rectangleRus = _this2.drawRectangle(stage, layer, id, rus);\n\n        layer.add(rectangleEng);\n        layer.add(rectangleRus);\n      });\n      layer.draw();\n    } //---------Отрисовка и определение игрового поля----------\n\n  }, {\n    key: \"createKonva\",\n    value: function createKonva() {\n      var stage = new Konva.Stage({\n        container: 'game-drag-and-drop',\n        width: document.getElementById('container-konva').offsetWidth,\n        height: document.getElementById('container-konva').offsetHeight\n      });\n      var layer = new Konva.Layer();\n      var tempLayer = new Konva.Layer();\n      var drop = false;\n      var that = this;\n      var previousShape;\n      var colorBack;\n      stage.add(layer);\n      stage.add(tempLayer);\n      this.drawDictionary(stage, layer); //начало перемещение фигуры\n\n      stage.on(\"dragstart\", function (e) {\n        e.target.moveTo(tempLayer);\n        console.log('start'); //    text.text('Moving ' + e.target.name());\n\n        if (drop && previousShape) {\n          previousShape.fire('dragleave', {\n            type: 'dragleave',\n            target: previousShape,\n            evt: e.e\n          }, true);\n          previousShape = undefined;\n        }\n\n        layer.draw();\n      }); //движение фигуры\n\n      stage.on(\"dragmove\", function (evt) {\n        var pos = stage.getPointerPosition();\n        var shape = layer.getIntersection(pos, 'Group');\n        if (!previousShape && !shape) return;\n\n        if (previousShape && shape) {\n          if (previousShape !== shape) {\n            // leave from old targer\n            previousShape.fire('dragleave', {\n              type: 'dragleave',\n              target: previousShape,\n              evt: evt.evt\n            }, true); // enter new targer\n\n            shape.fire('dragenter', {\n              type: 'dragenter',\n              target: shape,\n              evt: evt.evt\n            }, true);\n            previousShape = shape;\n          } else {\n            previousShape.fire('dragover', {\n              type: 'dragover',\n              target: previousShape,\n              evt: evt.evt\n            }, true);\n          }\n        } else if (!previousShape && shape) {\n          previousShape = shape;\n          shape.fire('dragenter', {\n            type: 'dragenter',\n            target: shape,\n            evt: evt.evt\n          }, true);\n        } else if (previousShape && !shape) {\n          previousShape.fire('dragleave', {\n            type: 'dragleave',\n            target: previousShape,\n            evt: evt.evt\n          }, true);\n          previousShape = undefined;\n        } else return;\n      }); //опустить фигуру и закончить перемещение\n\n      stage.on(\"dragend\", function (e) {\n        console.log('end');\n\n        if (previousShape) {\n          if (previousShape.getName() === e.target.getName()) {\n            e.target.moveTo(layer);\n            e.target.destroy();\n            previousShape.destroy();\n            that.upPoints();\n            layer.draw();\n            tempLayer.draw();\n            that.checkEnd(layer, stage);\n            return;\n          } else {\n            that.downPoints();\n            previousShape.fire('drop', {\n              type: 'drop',\n              target: previousShape,\n              evt: e.evt\n            }, true);\n            drop = true;\n          }\n        }\n\n        e.target.moveTo(layer);\n        layer.draw();\n        tempLayer.draw();\n      }); //опустить фигуру на другую\n\n      stage.on(\"drop\", function (e) {\n        console.log('drop');\n        console.log(e.target);\n        var rectLower = e.target.getChildren()[0];\n        rectLower.fill('red'); //  text.text('drop ' + e.target.name());\n\n        layer.draw();\n      }); //начало перетаскивания\n\n      stage.on(\"dragenter\", function (e) {\n        console.log('enter');\n        var rectLower = e.target.getChildren()[0];\n        colorBack = rectLower.getAttr('fill');\n        rectLower.fill('yellow');\n        layer.draw();\n      }); //перетаскивание с прикрытой фигуры и возвращение той в исх.состояние\n\n      stage.on(\"dragleave\", function (e) {\n        console.log('leave');\n        console.log(e.target);\n        var rectLower = e.target.getChildren()[0];\n        rectLower.fill(colorBack); // text.text('dragleave ' + e.target.name());\n\n        layer.draw();\n      }); //другая фигура полностью покинута текущей\n\n      stage.on(\"dragover\", function (e) {\n        console.log('over'); // text.text('dragover ' + e.target.name());\n\n        layer.draw();\n      });\n    } //---------Проверка конца игры---------------\n\n  }, {\n    key: \"checkEnd\",\n    value: function checkEnd(layer, stage) {\n      console.log(layer);\n      console.log(layer.children.length);\n\n      if (layer.children.length === 0) {\n        console.log('Игра закончена');\n        stage.destroy();\n        this.endGame();\n      } else console.log('Продолжаем игру');\n    }\n  }]);\n\n  return DragAndDropGame;\n}(_Game__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/GameDragAndDrop.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/GameExamplesSentences.js":
/*!**********************************************************!*\
  !*** ./Scripts/myscripts/games/GameExamplesSentences.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ExampleSentencesGame; });\n/* harmony import */ var _OxfordApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OxfordApi */ \"./Scripts/myscripts/games/OxfordApi.js\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Game */ \"./Scripts/myscripts/games/Game.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _get(target, property, receiver) { if (typeof Reflect !== \"undefined\" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }\n\nfunction _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\nvar ExampleSentencesGame =\n/*#__PURE__*/\nfunction (_Game) {\n  _inherits(ExampleSentencesGame, _Game);\n\n  function ExampleSentencesGame() {\n    var _this;\n\n    _classCallCheck(this, ExampleSentencesGame);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExampleSentencesGame).call(this));\n    _this.sentences = null;\n    _this.limitSentences = 6;\n    _this.answerButton = 0;\n    return _this;\n  }\n\n  _createClass(ExampleSentencesGame, [{\n    key: \"start\",\n    value: function start() {\n      var _this2 = this;\n\n      _get(_getPrototypeOf(ExampleSentencesGame.prototype), \"start\", this).call(this);\n\n      console.log(\"Начало игры\");\n      this.initStep();\n      var connDictionary = this.getWordsFromDictionary();\n      connDictionary.then(function (dictionary) {\n        console.log(dictionary);\n        dictionary.sort(function () {\n          return Math.random() - 0.5;\n        });\n        console.log(dictionary);\n        _this2.dictionary = dictionary;\n        _this2.lenghtDictionary = Object.keys(_this2.dictionary).length;\n\n        if (!_this2.validation()) {\n          return;\n        }\n\n        _this2.step(0);\n      }).catch(function (error) {\n        return console.log(\" \\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u043E\\u0442\\u0440\\u0438\\u0441\\u043E\\u0432\\u043A\\u0438 \\u0438\\u0433\\u0440\\u044B \".concat(error));\n      });\n    } //--------Получение предложений из Оксфордского словаря--------\n\n  }, {\n    key: \"getSentense\",\n    value: function getSentense(word) {\n      var _this3 = this;\n\n      var connOxford = new _OxfordApi__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n      return connOxford.getSentenseExemple(word).then(function (sentenses) {\n        if (!sentenses) return null;\n        sentenses = sentenses.filter(function (item, index) {\n          return index < _this3.limitSentences;\n        });\n        sentenses = sentenses.map(function (item) {\n          return item.replace(new RegExp(word.toLowerCase(), 'gi'), '_'.repeat(word.length));\n        });\n        return sentenses;\n      });\n    } //--------Cлучайное значение в массиве--------\n\n  }, {\n    key: \"getRandomValueArray\",\n    value: function getRandomValueArray(arr) {\n      var index = Math.floor(Math.random() * arr.length);\n      return arr[index];\n    } //-----------Отрисовка текста на поле---------------\n\n  }, {\n    key: \"drawTextInDOM\",\n    value: function drawTextInDOM() {\n      var textDOM = document.getElementById('block-examples-texts');\n      var sentences = this.sentences;\n      var list = '';\n\n      for (var i = 0; i < sentences.length; i++) {\n        list += \"<li>\".concat(sentences[i], \"</li>\");\n      }\n\n      textDOM.innerHTML = \"<ul> \".concat(list, \" </ul>\");\n    } //-------Проверка словаря----------\n\n  }, {\n    key: \"validation\",\n    value: function validation() {\n      _get(_getPrototypeOf(ExampleSentencesGame.prototype), \"validation\", this).call(this);\n\n      if (this.lengthDictionary <= 3) {\n        //месседж на экране\n        console.log(\"Недостаточно слов в словаре\");\n        return false;\n      }\n\n      return true;\n    } //--------Инициализация шага---------\n\n  }, {\n    key: \"initStep\",\n    value: function initStep() {\n      document.getElementById(\"body-third-game\").style.display = 'none';\n      var preloaderDOM = document.getElementsByClassName('lds-default')[0];\n      preloaderDOM.style.display = 'block';\n    } //--------Отрисовка шага-------------\n\n  }, {\n    key: \"drawStep\",\n    value: function drawStep(i, word) {\n      this.drawTextInDOM();\n      this.drawButtonInDOM(i, word);\n      document.getElementById(\"body-third-game\").style.display = 'block';\n      var preloaderDOM = document.getElementsByClassName('lds-default')[0];\n      preloaderDOM.style.display = 'none';\n    } //-----------Отрисовка кнопок-----------\n\n  }, {\n    key: \"drawButtonInDOM\",\n    value: function drawButtonInDOM(i, word) {\n      var _this4 = this;\n\n      //отрисовка кнопоки с правильным ответом\n      var orderButton = [0, 1, 2];\n      this.randomArraySort(orderButton);\n      var answer = orderButton[0];\n      this.answerButton = answer;\n      var buttonWithCurrentWord = document.getElementsByClassName('button-options')[answer];\n\n      buttonWithCurrentWord.onclick = function () {\n        _this4.upPoints();\n      };\n\n      buttonWithCurrentWord.innerText = word; //выбор 2х случайных слов из словоря:\n\n      var Word1 = word;\n      var Word2 = word;\n      var lengthDictionary = Object.keys(this.dictionary).length;\n      if (lengthDictionary > i) while (Word1 === word) {\n        Word1 = this.getRandomValueArray(this.dictionary).English;\n      }\n\n      while (Word2 === word || Word2 === Word1) {\n        Word2 = this.getRandomValueArray(this.dictionary).English;\n      }\n\n      var buttonWithRandomWord1 = document.getElementsByClassName('button-options')[orderButton[1]];\n\n      buttonWithRandomWord1.onclick = function () {\n        _this4.downPoints();\n      };\n\n      buttonWithRandomWord1.innerText = Word1;\n      var buttonWithRandomWord2 = document.getElementsByClassName('button-options')[orderButton[2]];\n\n      buttonWithRandomWord2.onclick = function () {\n        _this4.downPoints();\n      };\n\n      buttonWithRandomWord2.innerText = Word2;\n    } //----------Шаг игры--------\n\n  }, {\n    key: \"step\",\n    value: function step(i) {\n      var _this5 = this;\n\n      this.initStep();\n      var eng = this.dictionary[i].English;\n      console.log(eng);\n      this.getSentense(eng).then(function (sentense) {\n        if (!sentense) {\n          if (i == _this5.lenghtDictionary - 1) {\n            _this5.endGame();\n          } else {\n            _this5.step(++i);\n          }\n\n          return;\n        } //отрисовка текста\n\n\n        _this5.sentences = sentense;\n\n        _this5.drawStep(i, eng); //асинхронный запрос(ожидание,когда пользователь даст правильный ответ)\n\n\n        _this5.getAnswer().then(function (value) {\n          if (value) {\n            if (i == _this5.lenghtDictionary - 1) {\n              _this5.endGame();\n            } else _this5.step(++i);\n          }\n        }).catch(function (err) {\n          return console.log(err);\n        });\n      });\n    } //--------Асинхронная функция отслеживающая выбор правильного ответа----------\n\n  }, {\n    key: \"getAnswer\",\n    value: function getAnswer() {\n      var _this6 = this;\n\n      return new Promise(function (resolve) {\n        var index = _this6.answerButton;\n        document.getElementsByClassName('button-options')[index].addEventListener('click', function () {\n          resolve(true);\n        });\n      });\n    } //--------Перемешивание массива--------\n\n  }, {\n    key: \"randomArraySort\",\n    value: function randomArraySort(arr) {\n      for (var i = arr.length - 1; i > 0; i--) {\n        var j = Math.floor(Math.random() * (i + 1));\n        var _ref = [arr[j], arr[i]];\n        arr[i] = _ref[0];\n        arr[j] = _ref[1];\n      }\n    }\n  }]);\n\n  return ExampleSentencesGame;\n}(_Game__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/GameExamplesSentences.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/GameSpeech.js":
/*!***********************************************!*\
  !*** ./Scripts/myscripts/games/GameSpeech.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SpeechGame; });\n/* harmony import */ var _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AjaxRequest */ \"./Scripts/myscripts/games/AjaxRequest.js\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Game */ \"./Scripts/myscripts/games/Game.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _get(target, property, receiver) { if (typeof Reflect !== \"undefined\" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }\n\nfunction _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\nvar SpeechGame =\n/*#__PURE__*/\nfunction (_Game) {\n  _inherits(SpeechGame, _Game);\n\n  function SpeechGame() {\n    var _this;\n\n    _classCallCheck(this, SpeechGame);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpeechGame).call(this));\n    _this.currentText = '';\n    _this.currentRecognition = null;\n    _this.limitSentense = 6;\n    return _this;\n  } //-------Сеттер текущего текста на экране---------\n\n\n  _createClass(SpeechGame, [{\n    key: \"setCurrentText\",\n    value: function setCurrentText(text) {\n      this.currentText = text;\n    } //-------Сеттер текущего распознователя---------\n\n  }, {\n    key: \"setCurrentRecognition\",\n    value: function setCurrentRecognition(recognition) {\n      this.currentRecognition = recognition;\n    }\n  }, {\n    key: \"init\",\n    value: function init() {\n      var _this2 = this;\n\n      this.updateText();\n\n      document.getElementById(\"next-text-speech\").onclick = function () {\n        _this2.updateText();\n\n        _this2.start();\n      };\n\n      document.getElementById('stop-speech').onclick = function () {\n        _this2.currentRecognition.stop();\n      };\n    }\n  }, {\n    key: \"start\",\n    value: function start() {\n      var _this3 = this;\n\n      _get(_getPrototypeOf(SpeechGame.prototype), \"start\", this).call(this);\n\n      this.init();\n      console.log(\"Начало игры speech\");\n      var initialText = this.currentText;\n      if (!this.currentText) return;\n      this.recognizer().then(function (textRecord) {\n        console.log(\"\\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u044B\\u0439 \\u0442\\u0435\\u043A\\u0441\\u0442: \".concat(textRecord));\n        var interest = document.getElementsByClassName('result-speech')[0]; //процент\n\n        if (interest >= 50) {\n          _this3.upPoints();\n        } else {\n          _this3.downPoints();\n        }\n\n        interest.innerText = 'Вы угадали на:' + _this3.findCoincidences(initialText, textRecord) + '%';\n      }).catch(function (error) {\n        return console.log(\"\\u043E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u0440\\u0430\\u0441\\u043F\\u043E\\u0437\\u043D\\u043E\\u0432\\u0430\\u043D\\u0438\\u0438 \\u0433\\u043E\\u043B\\u043E\\u0441\\u0430: \".concat(error));\n      });\n    } //---------Распознование речи------------\n\n  }, {\n    key: \"recognizer\",\n    value: function recognizer() {\n      var _this4 = this;\n\n      var resultText = '';\n      var preloaderDOM = document.getElementsByClassName('lds-default')[0];\n      preloaderDOM.style.display = 'block';\n      return new Promise(function (resolve, reject) {\n        if ('webkitSpeechRecognition' in window) {\n          var recognition = new webkitSpeechRecognition();\n          recognition.lang = 'en';\n          recognition.continuous = true;\n\n          recognition.onresult = function (event) {\n            var result = event.results[event.resultIndex];\n            resultText += result[0].transcript;\n            console.log(result[0].transcript);\n          };\n\n          recognition.onend = function () {\n            console.log('Распознавание завершилось.');\n            preloaderDOM.style.display = 'none';\n            resolve(resultText);\n          };\n\n          recognition.start();\n          _this4.currentRecognition = recognition;\n        } else {\n          reject('webkitSpeechRecognition не поддерживается :(');\n        }\n      });\n    } //----------Обработка текста-----------\n\n  }, {\n    key: \"textProcessing\",\n    value: function textProcessing(text) {\n      text = text.toLowerCase();\n      text = text.replace(/[.,\\/#!$%\\^&\\*;:{}=\\-_`~()]/g, \"\"); //удаление знаков препинани\n\n      text = text.replace(/\\s{2,}/g, \" \"); //удаление лишних пробелов\n\n      return text;\n    } //----------Обработка текста и преобразование в массив-----------\n\n  }, {\n    key: \"textConvertInArray\",\n    value: function textConvertInArray(text) {\n      text = this.textProcessing(text);\n      text = text.split(' ');\n      return text;\n    } //---------Алгоритм нахождения совпадения оригинального текста и распознанного текста---------\n\n  }, {\n    key: \"algorithmCoincidences\",\n    value: function algorithmCoincidences(arr1, arr2) {\n      var findWords = 0;\n      var indexRecordPosition = 0;\n      if (arr1.length === 1 || arr2.length === 1) return 0;\n      arr1.forEach(function (word, index) {\n        var posPrev = indexRecordPosition - 1;\n        var posNext = indexRecordPosition + 1;\n        console.log(\"\\u0421\\u043B\\u043E\\u0432\\u043E: \".concat(index, \", \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F \\u0437\\u0430\\u043F\\u0438\\u0441\\u0438: \").concat(indexRecordPosition));\n\n        if (word === arr2[indexRecordPosition]) {\n          console.log(\"find \".concat(word));\n          ++findWords;\n          ++indexRecordPosition;\n        } else if (posPrev >= 0) {\n          if (word === arr2[posPrev]) {\n            console.log(\"find \".concat(word));\n            ++findWords;\n          }\n        } else if (posNext <= arr2.length - 1) {\n          if (word === arr2[posNext]) {\n            console.log(\"find \".concat(word));\n            ++findWords;\n            indexRecordPosition = posNext + 1;\n          }\n        } else ++indexRecordPosition;\n      });\n      return findWords;\n    }\n  }, {\n    key: \"getBook\",\n    value: function getBook() {\n      var url = \"\".concat(document.location.origin, \"/Games/GetBookAsync\");\n      var method = 'GET';\n      var conn = new _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__[\"default\"](url, method);\n      return conn.getJson();\n    }\n  }, {\n    key: \"bookProcessing\",\n    value: function bookProcessing(book) {\n      book = book.replace(/\\s{2,}/g, \" \"); //удаление лишних пробелов\n\n      book = book.split('.');\n      var index = Math.floor(Math.random() * book.length - this.limitSentense);\n      var newBook = [];\n\n      for (var i = index; i < index + this.limitSentense; i++) {\n        newBook.push(book[i]);\n      }\n\n      book = newBook.join('.');\n      book += '.';\n      return book;\n    } //--------Следующий текст---\\--------\n\n  }, {\n    key: \"updateText\",\n    value: function updateText() {\n      var _this5 = this;\n\n      var text = '';\n      this.getBook().then(function (book) {\n        text = _this5.bookProcessing(book);\n\n        _this5.setCurrentText(text);\n\n        _this5.updateTextDOM();\n      }).catch(function (error) {\n        console.log(\"\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u043D\\u0430\\u0445\\u043E\\u0436\\u0434\\u0435\\u043D\\u0438\\u0438 \\u0442\\u0435\\u043A\\u0441\\u0442\\u0430 \".concat(error));\n\n        _this5.message(\"\\u0418\\u0437\\u0432\\u0438\\u043D\\u0438\\u0442\\u0435, \\u0442\\u0435\\u043A\\u0441\\u0442 \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435\\u0442 \\u0431\\u044B\\u0442\\u044C \\u0437\\u0430\\u0433\\u0440\\u0443\\u0436\\u0435\\u043D\");\n\n        return;\n      });\n    } //--------Отрисовка текста в DOM--------\n\n  }, {\n    key: \"updateTextDOM\",\n    value: function updateTextDOM() {\n      var textDOM = document.getElementsByClassName('text-speech')[0];\n      textDOM.innerText = this.currentText;\n    } //-------Обработка текста и вывод процентов-----------\n\n  }, {\n    key: \"findCoincidences\",\n    value: function findCoincidences(textInput, textRecord) {\n      var arrTextInput = this.textConvertInArray(textInput);\n      var arrTextRecord = this.textConvertInArray(textRecord);\n      var totalWords = arrTextInput.length,\n          findWords = 0,\n          interest = 0; //текстов нет\n\n      console.log(arrTextInput);\n      console.log(arrTextRecord);\n      console.log(totalWords);\n      findWords = this.algorithmCoincidences(arrTextInput, arrTextRecord);\n      if (findWords === 0) return 0;\n      interest = Math.floor(findWords / totalWords * 100);\n      return interest;\n    } //-----Окрашивание текста--------- \n\n  }, {\n    key: \"colorText\",\n    value: function colorText() {}\n  }]);\n\n  return SpeechGame;\n}(_Game__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/GameSpeech.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/GameWordTranslation.js":
/*!********************************************************!*\
  !*** ./Scripts/myscripts/games/GameWordTranslation.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return WordTranslationGame; });\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game */ \"./Scripts/myscripts/games/Game.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\nvar WordTranslationGame =\n/*#__PURE__*/\nfunction (_Game) {\n  _inherits(WordTranslationGame, _Game);\n\n  function WordTranslationGame() {\n    _classCallCheck(this, WordTranslationGame);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(WordTranslationGame).call(this));\n  }\n\n  _createClass(WordTranslationGame, [{\n    key: \"start\",\n    value: function start() {\n      var _this = this;\n\n      console.log(\"Начало игры\");\n      var connDictionary = this.getWordsFromDictionary();\n      connDictionary.then(function (dictionary) {\n        //перемешиваем массив случайным образом\n        if (dictionary) dictionary.sort(function () {\n          return Math.random() - 0.5;\n        });\n\n        _this.setDictionary(dictionary);\n\n        if (!_this.validation()) return;\n\n        _this.stepWithInterval(_this.lenghtDictionary - 1);\n      }).catch(function (error) {\n        return console.log(\" \\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u0438 \\u043E\\u0442\\u0440\\u0438\\u0441\\u043E\\u0432\\u043A\\u0438 \\u0438\\u0433\\u0440\\u044B \".concat(error));\n      });\n    } //-----Инициализация таймера-----\n\n  }, {\n    key: \"setTimerDOM\",\n    value: function setTimerDOM() {\n      var timerInDOM = document.getElementById('timer');\n      timerInDOM.innerText = this.time;\n      timerInDOM.className = '';\n    } //------Инициализации карточки с английским словом-------\n\n  }, {\n    key: \"setEnglishTextDOM\",\n    value: function setEnglishTextDOM(word) {\n      var engDOM = document.getElementById('card-eng');\n      engDOM.innerText = word;\n    } //-------Работа таймера и проверка ответа(замыкание)-------\n\n  }, {\n    key: \"timer\",\n    value: function timer(i) {\n      var _this2 = this;\n\n      var time = this.time;\n      var russianWord = this.dictionary[i].Russia;\n      var timerInDOM = document.getElementById('timer');\n      var rusDOM = document.getElementById('user-input');\n      this.setTimerDOM();\n      var currentInterval = setInterval(function () {\n        console.log(\"\\u0432\\u0440\\u0435\\u043C\\u044F \".concat(time, \"; i=\").concat(i, \" \\u043F\\u0435\\u0440\\u0435\\u0432\\u043E\\u0434=\").concat(russianWord));\n        time--;\n        timerInDOM.innerText = time;\n\n        if (time === 3) {\n          timerInDOM.className = 'red-text';\n        }\n\n        if (time <= 0) {\n          _this2.downPoints();\n\n          clearInterval(currentInterval);\n\n          _this2.stepWithInterval(i - 1);\n\n          return;\n        }\n\n        rusDOM.addEventListener('keyup', function () {\n          if (russianWord.toLowerCase() === rusDOM.value.toLowerCase()) {\n            _this2.upPoints();\n\n            clearInterval(currentInterval);\n\n            _this2.stepWithInterval(i - 1);\n\n            return;\n          }\n        });\n      }, 1000);\n    } //----------Шаг игры--------\n\n  }, {\n    key: \"stepWithInterval\",\n    value: function stepWithInterval(i) {\n      document.getElementById('user-input').value = '';\n\n      if (i >= 0) {\n        this.setEnglishTextDOM(this.dictionary[i].English);\n        this.timer(i);\n      } else {\n        this.endGame();\n      }\n    }\n  }]);\n\n  return WordTranslationGame;\n}(_Game__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/GameWordTranslation.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/OxfordApi.js":
/*!**********************************************!*\
  !*** ./Scripts/myscripts/games/OxfordApi.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return OxfordApi; });\n/* harmony import */ var _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AjaxRequest */ \"./Scripts/myscripts/games/AjaxRequest.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n//получение текста из запроса к оксфордскому словарю\n\n\nvar OxfordApi =\n/*#__PURE__*/\nfunction () {\n  function OxfordApi() {\n    _classCallCheck(this, OxfordApi);\n\n    this.urlServerAudio = \"\".concat(document.location.origin, \"/Games/OxfordAudio\");\n    this.urlSeverSentense = \"\".concat(document.location.origin, \"/Games/OxfordSentense\");\n  } //получение примеров предложений\n\n\n  _createClass(OxfordApi, [{\n    key: \"getSentenseExemple\",\n    value: function getSentenseExemple(word) {\n      var sentense = [];\n      var urlServer = \"\".concat(this.urlSeverSentense, \"?word=\").concat(word.toLowerCase());\n      var conn = new _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__[\"default\"](urlServer, this.method);\n      return conn.getJson().then(function (response) {\n        if (response == \"word not found\") return null;\n        var responseJson = JSON.parse(response);\n        responseJson = responseJson.results[0].lexicalEntries[0].sentences;\n        responseJson.forEach(function (item) {\n          sentense.push(item.text);\n        });\n        return sentense;\n      });\n    }\n  }, {\n    key: \"getAudioExemple\",\n    value: function getAudioExemple(word) {\n      var urlAudio = '';\n      var urlServer = this.urlServerAudio + '?word=' + word;\n      var conn = new _AjaxRequest__WEBPACK_IMPORTED_MODULE_0__[\"default\"](urlServer, this.method);\n      return conn.getJson().then(function (response) {\n        if (response == \"audio not found\") return null;\n        var responseJson = JSON.parse(response);\n        urlAudio = responseJson.results[0].lexicalEntries[0].pronunciations[0].audioFile;\n        console.log(responseJson);\n        return urlAudio;\n      });\n    }\n  }]);\n\n  return OxfordApi;\n}();\n\n\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/OxfordApi.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/index.js":
/*!******************************************!*\
  !*** ./Scripts/myscripts/games/index.js ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Context */ \"./Scripts/myscripts/games/Context.js\");\n/* harmony import */ var _GameDragAndDrop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameDragAndDrop */ \"./Scripts/myscripts/games/GameDragAndDrop.js\");\n/* harmony import */ var _GameWordTranslation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameWordTranslation */ \"./Scripts/myscripts/games/GameWordTranslation.js\");\n/* harmony import */ var _GameExamplesSentences__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GameExamplesSentences */ \"./Scripts/myscripts/games/GameExamplesSentences.js\");\n/* harmony import */ var _GameSpeech__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GameSpeech */ \"./Scripts/myscripts/games/GameSpeech.js\");\n/* harmony import */ var _GameAudioTranslation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./GameAudioTranslation */ \"./Scripts/myscripts/games/GameAudioTranslation.js\");\n/* harmony import */ var _route__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./route */ \"./Scripts/myscripts/games/route.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\n\n\n\n\nvar Main =\n/*#__PURE__*/\nfunction () {\n  function Main() {\n    _classCallCheck(this, Main);\n  }\n\n  _createClass(Main, [{\n    key: \"run\",\n    value: function run() {\n      var currentPathName = document.location.pathname;\n      var action = _route__WEBPACK_IMPORTED_MODULE_6__[\"default\"][currentPathName];\n      var context = new _Context__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n      console.log(\"\\u0422\\u0435\\u043A\\u0443\\u0449\\u0435\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0435: \".concat(action));\n\n      switch (action) {\n        case \"dragAndDrop\":\n          context.setGame(new _GameDragAndDrop__WEBPACK_IMPORTED_MODULE_1__[\"default\"]());\n          console.log(\"dragAndDrop\");\n          break;\n\n        case \"wordTranslation\":\n          context.setGame(new _GameWordTranslation__WEBPACK_IMPORTED_MODULE_2__[\"default\"]());\n          console.log(\"wordTranslation\");\n          break;\n\n        case \"exampleSentences\":\n          context.setGame(new _GameExamplesSentences__WEBPACK_IMPORTED_MODULE_3__[\"default\"]());\n          console.log(\"context\");\n          break;\n\n        case \"speech\":\n          context.setGame(new _GameSpeech__WEBPACK_IMPORTED_MODULE_4__[\"default\"]());\n          break;\n\n        case \"audioTranslation\":\n          context.setGame(new _GameAudioTranslation__WEBPACK_IMPORTED_MODULE_5__[\"default\"]());\n          console.log(\"audioTranslation\");\n          break;\n\n        default:\n          console.log(\"Такой игры нет\");\n      }\n\n      if (context.game) context.startGame();\n    }\n  }]);\n\n  return Main;\n}();\n\nvar main = new Main();\nmain.run();\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/index.js?");

/***/ }),

/***/ "./Scripts/myscripts/games/route.js":
/*!******************************************!*\
  !*** ./Scripts/myscripts/games/route.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar routes = {\n  \"/Games/DragAndDrops\": \"dragAndDrop\",\n  \"/Games/WordTranslationGame\": \"wordTranslation\",\n  \"/Games/ExampleSentencesGame\": \"exampleSentences\",\n  \"/Games/SpeechGame\": \"speech\",\n  \"/Games/AudioGame\": \"audioTranslation\"\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (routes);\n\n//# sourceURL=webpack:///./Scripts/myscripts/games/route.js?");

/***/ })

/******/ });