function main() {
    const base = Process.getModuleByName('libg.so').base;
    const malloc = new NativeFunction(Process.getModuleByName('libc.so').getExportByName('malloc'), 'pointer', ['uint']);
    //offset nb v65
    const TextInput_setMaxTextLength = 0xB69F94; //v65 | near String "TID_TEAM_SEARCH_POPUP_TITLE"
    const TID_CONNECTING_TO_SERVER = 0x19FBAA; //v65 | Strings
    const Gui_getInstance = 0x564DE4; //v65 | String "TID_TEAM_REQEST_JOIN_FAIL_PENDING_JOIN_REQUEST"
    const String_String = 0xB28390; //v65 i dont sure | String "SCIDGuestLPD"
    const laser_screen_mask = 0x1D0AC4; //v65 | String
    const sm_slowMode = 0x115BCB0; //v65 | GameMain::update sm_slowMode
    const GUI_showFloaterTextAtDefaultPoss = 0x56588c; //v65 | String "TID_MAP_EDITOR_SAVE_ERROR"
    const BattleScreen_isAFK = 0x7AECD8; //v65 | near String "TID_AFK_WARNING"

    const LogicSkinData_createReferences = new NativeFunction(base.add(0xC9195C), 'void', ['pointer']);// v65 | String "OutlineShader"
    const GameButton_GameButton = new NativeFunction(base.add(0x56B8B0), 'void', ['pointer']); // v65 | String "TID_BUTTON_SCID" + "button_scid"
    //GameButton::GameButton(v118);
    const StringTable_getMovieClip = new NativeFunction(base.add(0x94BD5C), 'pointer', ['pointer', 'pointer']); // v65 |String "icon_modifier_%i" 
    /* if ( MovieClipHelper::hasMovieClip(v20, &v21, v16) )
        {
          *(a1[44] + 4 * v15) = StringTable::getMovieClip(v20, &v21, v17);
    */
    const Stage_addChild = new NativeFunction(base.add(0x98C3F0), 'pointer', ['pointer', 'pointer']); // v65 | or 98C3F0
    const TextField_setText = new NativeFunction(base.add(0x9A2224), 'pointer', ['pointer', 'pointer', 'bool']);
    const GameButton_buttonPressed = new NativeFunction(base.add(0x56BDD0), 'void', ['pointer']); // v65
    const MovieClip_gotoAndStop = new NativeFunction(base.add(0x9734D4), 'void', ['pointer', 'int']); // v65 | both this two are String "processing"

    const Gui_getInstance_const = new NativeFunction(base.add(Gui_getInstance), "pointer", []);
    const Gui_showFloaterTextAtDefaultPos = new NativeFunction(base.add(GUI_showFloaterTextAtDefaultPoss), "void", ["pointer", "pointer", "int", "int"]);
    const StringCtor = new NativeFunction(base.add(String_String), "pointer", ["pointer", "pointer"]);

    const stage_instance = base.add(0x1161FD8).readPointer(); //Stage_sm_pInstance

    //Byeee
    const BattleScreen_shouldShow_1 = 0x77b1c0;
    const BattleScreen_shouldShow_2 = 0x787c74;
    const BattleScreen_shouldShow_3 = 0x787b40;
    const BattleScreen_shouldShow_4 = 0x645B04;
    const TeamMemberItem_isOwnSide = 0x6DB92C; // String: "hidden_hero", v = a7 == 0 check | v65 test js try

    function WriteToMemory(address, valueType, value) {
    switch (valueType.toLowerCase()) {
        case "u8":
            Memory.protect(address, 1, "rwx");
            Memory.writeU8(address, value);
            break;
        case "byte":
            Memory.protect(address, 1, "rwx");
            Memory.writeS8(address, value);
            break;
        case "ushort":
            Memory.protect(address, 2, "rwx");
            Memory.writeU16(address, value);
            break;
        case "short":
            Memory.protect(address, 2, "rwx");
            Memory.writeS16(address, value);
            break;
        case "uint":
            Memory.protect(address, 4, "rwx");
            Memory.writeU32(address, value);
            break;
        case "int":
            Memory.protect(address, 4, "rwx");
            Memory.writeS32(address, value);
            break;
        case "float":
            Memory.protect(address, 4, "rwx");
            Memory.writeFloat(address, value);
            break;
        case "pointer":
            Memory.protect(address, 4, "rwx");
            Memory.writePointer(address, value);
            break;
        case "ulong":
            Memory.protect(address, 8, "rwx");
            Memory.writeU64(address, value);
            break;
        case "long":
            Memory.protect(address, 8, "rwx");
            Memory.writeS64(address, value);
            break;
        case "double":
            Memory.protect(address, 8, "rwx");
            Memory.writeDouble(address, value);
            break;
        case "bytearray":
            Memory.protect(address, value.length, "rwx");
            Memory.writeByteArray(address, value);
            break;
        case "string":
            Memory.protect(address, value.length, "rwx");
            Memory.writeUtf8String(address, value);
            break;
    }
    }

    let button = null;
    function setPosition(ptr, x, y) { ptr.add(32).writeFloat(x); ptr.add(36).writeFloat(y); }

    function setSize(ptr, h, w) { ptr.add(16).writeFloat(h); ptr.add(28).writeFloat(w); }

    function strPtr(str) { return Memory.allocUtf8String(str); }

    function scPtr(str) { const ptr = malloc(40); StringCtor(ptr, strPtr(str)); return ptr; }

    function showFloater(text) {
        const inst = Gui_getInstance_const();
        const scptr = scPtr(text);
        if (!inst || inst.isNull && inst.isNull()) {
            return;
        }
        if (!scptr || (scptr.isNull && scptr.isNull())) {
            return;
        }
        try {
            Gui_showFloaterTextAtDefaultPos(inst, scptr, 0, 0);
        } catch (e) {}
    }

    function name_mod() {//name 15->16 clan maybe no limited
        const originalSetMaxTextLength = new NativeFunction(
            base.add(TextInput_setMaxTextLength),
            'void', 
            ['pointer', 'int']
        );

        Interceptor.replace(base.add(TextInput_setMaxTextLength), new NativeCallback(function(a1, maxLength) {
            originalSetMaxTextLength(a1, 999999);
        }, 'void', ['pointer', 'int']));
    }

    function no_afk_warning() {
        Interceptor.replace(base.add(BattleScreen_isAFK), new NativeCallback(function(a1, a2) {//BattleScreen::isAFK
            return 0;
        }, 'bool', ['int64', 'pointer']));

        /*
            v24 = BattleScreen::getInstance();
            v25 = BattleScreen::isAFK(v24);
        */
    }

    function text_fun() {
        showFloater("QQ 197939338");
        console.log('done floater');
    }

    function edit_text_mod() {
        WriteToMemory(base.add(TID_CONNECTING_TO_SERVER), "string", "Spike Stars | @SpikeIsCute");
    }

    function no_black_border() {/* NO BLACK BORDER */
        WriteToMemory(base.add(laser_screen_mask), "String", "empty");// HideLaserScreenMask "laser_screen_mask"
    }

    function slow_mode(){
        WriteToMemory(base.add(sm_slowMode), "Byte", 1);
        //off = 0
        //on = 1
    }

    function remove_outline() {
        Interceptor.replace(LogicSkinData_createReferences, new NativeCallback(function (a1) {
            LogicSkinData_createReferences(a1);
            a1.add(120).writeByteArray('shader/impostor'.scPtr().readByteArray(16));
        }, 'void', ['pointer']));
    }

    function createbutton() {
        button = malloc(544);
        GameButton_GameButton(button);

        const clip = StringTable_getMovieClip(strPtr("sc/ui.sc"), strPtr("map_editor_exit_button"));
        MovieClip_gotoAndStop(clip, 1);

        const initFn = new NativeFunction(button.readPointer().add(352).readPointer(), 'void', ['pointer', 'pointer', 'bool']);
        initFn(button, clip, 1);

        TextField_setText(button, scPtr("Menu"), 1);
        setPosition(button, 50, 400);
        Stage_addChild(stage_instance, button);

        console.log("button created");

        return button;
    }

    Interceptor.attach(GameButton_buttonPressed, {
        onEnter(args) {
            if (button && args[0].toInt32() === button.toInt32()) {
                console.log("Button clicked");
            }
        }
    });

    no_afk_warning(); //only dont show warning
    name_mod();
    //text_fun();//??
    no_black_border();
    edit_text_mod();
    slow_mode();
    //remove_outline();
    createbutton();
    console.log('every things donea');

    //buff_visual(); bye cuz it removed from xref
    //welo_mod(); bye cuz it removed from xref
    //show_brawler(); //cant find offset try v65
}

setTimeout(main,3500);

/*
function buff_visual() {
        Interceptor.replace(base.add(0x9ee69c), new NativeCallback(function(a1) { // LogicCharacterClient_hasSlowDebuffClient
            return 0;
        }, 'int64', ['int64']));
        Interceptor.replace(base.add(0x9ee998), new NativeCallback(function(a1) { // LogicCharacterClient_getSpeedBuff
            return 1;
        }, 'int64', ['int64']));
        Interceptor.replace(base.add(0x9ee694), new NativeCallback(function(a1) { // LogicCharacterClient_hasDamageBuffClient
            return 1;
        }, 'int64', ['int64']));
        Interceptor.replace(base.add(0x9eeba8), new NativeCallback(function(a1) { // LogicCharacterClient_hasSpeedBuffClient
            return 1;
        }, 'int64', ['int64']));
}

function welo_mod() {//fucking nb dont have this mod
        const base = Process.getModuleByName('libg.so').base;
        Interceptor.replace(base.add(BattleScreen_shouldShow_1), new NativeCallback(function(a1, a2) {//BattleScreen::shouldShowMoveStick,utli,chat,etc
            return 1;
        }, 'bool', ['int64', 'pointer']));
        Interceptor.replace(base.add(BattleScreen_shouldShow_2), new NativeCallback(function(a1, a2) {
            return 1;
        }, 'bool', ['int64', 'pointer']));
        Interceptor.replace(base.add(BattleScreen_shouldShow_3), new NativeCallback(function(a1, a2) {
            return 1;
        }, 'bool', ['int64', 'pointer']));
        Interceptor.replace(base.add(BattleScreen_shouldShow_4), new NativeCallback(function(a1, a2) {
            return 1;
        }, 'bool', ['int64', 'pointer']));
}

function show_brawler() {
    Memory.protect(base.add(TeamMemberItem_isOwnSide), 1, 'rwx');
    base.add(TeamMemberItem_isOwnSide).writeU8(0);
}
*/