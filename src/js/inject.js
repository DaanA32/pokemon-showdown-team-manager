TeambuilderRoom.prototype.updateTeamList = function (resetScroll) {
    var teams = Storage.teams;
    var buf = '';

    // teampane
    buf += this.clipboardHTML();

    var filterFormat = '';

    // filterFolder === undefined: show teams in any folder
    // filterFolder === '': show only teams that don't have a folder
    var filterFolder;

    if (!this.curFolder) {
        buf += '<h2>Hi</h2>';
        buf += '<p>Did you have a good day?</p>';
        buf += '<p><button class="button" name="greeting" value="Y"><i class="fa fa-smile-o"></i> Yes, my day was pretty good</button> <button class="button" name="greeting" value="N"><i class="fa fa-frown-o"></i> No, it wasn\'t great</button></p>';
        buf += '<h2>All teams</h2>';
    } else {
        if (this.curFolder.slice(-1) === '/') {
            filterFolder = this.curFolder.slice(0, -1);
            if (filterFolder) {
                buf += '<h2><i class="fa fa-folder-open"></i> ' + filterFolder + ' <button class="button small" style="margin-left:5px" name="renameFolder"><i class="fa fa-pencil"></i> Rename</button> <button class="button small" style="margin-left:5px" name="promptDeleteFolder"><i class="fa fa-times"></i> Remove</button></h2>';
            } else {
                buf += '<h2><i class="fa fa-folder-open-o"></i> Teams not in any folders</h2>';
            }
        } else {
            filterFormat = this.curFolder;
            buf += '<h2><i class="fa fa-folder-open-o"></i> ' + filterFormat + '</h2>';
        }
    }

    var newButtonText = "New Team";
    if (filterFolder) newButtonText = "New Team in folder";
    if (filterFormat && filterFormat !== 'gen7') {
        newButtonText = "New " + Tools.escapeFormat(filterFormat) + " Team";
    }
    buf += '<p><button name="newTop" class="button big"><i class="fa fa-plus-circle"></i> ' + newButtonText + '</button>';
    buf += '<button id="upload-button" class="button big upload-button"></i>Upload</button>';
    buf += '<button id="download-button" class="button big download-button"></i>Download</button>';

    buf += '</p><ul class="teamlist">';
    var atLeastOne = false;

    try {
        if (!window.localStorage && !window.nodewebkit) buf += '<li>== CAN\'T SAVE ==<br /><small>Your browser doesn\'t support <code>localStorage</code> and can\'t save teams! Update to a newer browser.</small></li>';
    } catch (e) {
        buf += '<li>== CAN\'T SAVE ==<br /><small><code>Cookies</code> are disabled so you can\'t save teams! Enable them in your browser settings.</small></li>';
    }
    if (Storage.cantSave) buf += '<li>== CAN\'T SAVE ==<br /><small>You hit your browser\'s limit for team storage! Please backup them and delete some of them. Your teams won\'t be saved until you\'re under the limit again.</small></li>';
    if (!teams.length) {
        if (this.deletedTeamLoc >= 0) {
            buf += '<li><button name="undoDelete"><i class="fa fa-undo"></i> Undo Delete</button></li>';
        }
        buf += '<li><p><em>you don\'t have any teams lol</em></p></li>';
    } else {

        for (var i = 0; i < teams.length + 1; i++) {
            if (i === this.deletedTeamLoc) {
                if (!atLeastOne) atLeastOne = true;
                buf += '<li><button name="undoDelete"><i class="fa fa-undo"></i> Undo Delete</button></li>';
            }
            if (i >= teams.length) break;

            var team = teams[i];

            if (team && !team.team && team.team !== '') {
                team = null;
            }
            if (!team) {
                buf += '<li>Error: A corrupted team was dropped</li>';
                teams.splice(i, 1);
                i--;
                if (this.deletedTeamLoc && this.deletedTeamLoc > i) this.deletedTeamLoc--;
                continue;
            }

            if (filterFormat && filterFormat !== (team.format || 'gen7')) continue;
            if (filterFolder !== undefined && filterFolder !== team.folder) continue;

            if (!atLeastOne) atLeastOne = true;
            var formatText = '';
            if (team.format) {
                formatText = '[' + team.format + '] ';
            }
            if (team.folder) formatText += team.folder + '/';

            // teams are <div>s rather than <button>s because Firefox doesn't
            // support dragging and dropping buttons.
            buf += '<li><div name="edit" data-value="' + i + '" class="team" draggable="true">' + formatText + '<strong>' + Tools.escapeHTML(team.name) + '</strong><br /><small>';
            buf += Storage.getTeamIcons(team);
            buf += '</small></div><button name="edit" value="' + i + '"><i class="fa fa-pencil" aria-label="Edit" title="Edit (you can also just click on the team)"></i></button><button name="newTop" value="' + i + '" title="Duplicate" aria-label="Duplicate"><i class="fa fa-clone"></i></button><button name="delete" value="' + i + '"><i class="fa fa-trash"></i> Delete</button></li>';
        }
        if (!atLeastOne) {
            if (filterFolder) {
                buf += '<li><p><em>you don\'t have any teams in this folder lol</em></p></li>';
            } else {
                buf += '<li><p><em>you don\'t have any ' + this.curFolder + ' teams lol</em></p></li>';
            }
        }
    }

    buf += '</ul>';
    if (atLeastOne) {
        buf += '<p><button name="new" class="button"><i class="fa fa-plus-circle"></i> ' + newButtonText + '</button></p>';
    }

    if (window.nodewebkit) {
        buf += '<button name="revealFolder" class="button"><i class="fa fa-folder-open"></i> Reveal teams folder</button> <button name="reloadTeamsFolder" class="button"><i class="fa fa-refresh"></i> Reload teams files</button> <button name="backup" class="button"><i class="fa fa-upload"></i> Backup/Restore all teams</button>';
    } else if (this.curFolder) {
        buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Backup all teams from this folder</button>';
    } else if (atLeastOne) {
        buf += '<p><strong>Clearing your cookies (specifically, <code>localStorage</code>) will delete your teams.</strong> <span class="storage-warning">Browsers sometimes randomly clear cookies - you should back up your teams or use the desktop client if you want to make sure you don\'t lose them.</span></p>';
        buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Backup/Restore all teams</button>';
        buf += '<p>If you want to clear your cookies or <code>localStorage</code>, you can use the Backup/Restore feature to save your teams as text first.</p>';
        var self = this;
        if (navigator.storage && navigator.storage.persisted) {
            navigator.storage.persisted().then(function (state) {
                self.updatePersistence(state);
            });
        }
    } else {
        buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Restore teams from backup</button>';
    }

    var $pane = this.$('.teampane');
    $pane.html(buf);
    if (resetScroll) {
        $pane.scrollTop(0);
    } else if (this.teamScrollPos) {
        $pane.scrollTop(this.teamScrollPos);
        this.teamScrollPos = 0;
    }
}