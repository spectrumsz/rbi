-- Lua Library - Simple GUI Creator
local LuaLibrary = {}

-- Color options
LuaLibrary.Colors = {
    Red = Color3.fromRGB(255, 50, 50),
    Green = Color3.fromRGB(50, 255, 50),
    Blue = Color3.fromRGB(50, 100, 255),
    Yellow = Color3.fromRGB(255, 255, 50),
    Purple = Color3.fromRGB(180, 50, 255),
    Orange = Color3.fromRGB(255, 150, 50),
    Pink = Color3.fromRGB(255, 100, 200),
    Dark = Color3.fromRGB(0, 0, 0)
}

function LuaLibrary:CreateGUI(options)
    options = options or {}
    
    -- Create window using Rayfield
    local Window = RayfieldLibrary:CreateWindow({
        Name = options.title or "Lua Library GUI",
        LoadingTitle = "Loading Lua Library...",
        LoadingSubtitle = "Easy GUI Creation",
        ConfigurationSaving = {Enabled = false},
        Discord = {Enabled = false},
        KeySystem = false
    })
    
    local currentTab = Window:CreateTab("Main")
    
    -- Track elements for auto-positioning
    local functions = {}
    
    -- Basic element functions
    function functions:Label(text)
        currentTab:CreateSection(text)
        return {Set = function(newText) end} -- Dummy function for compatibility
    end
    
    function functions:Button(config)
        config = config or {}
        return currentTab:CreateButton({
            Name = config.text or "Button",
            Callback = config.click or function() end
        })
    end
    
    function functions:TextBox(config)
        config = config or {}
        return currentTab:CreateInput({
            Name = config.name or "Input",
            PlaceholderText = config.placeholder or "Type here...",
            RemoveTextAfterFocusLost = false,
            Callback = config.callback or function() end
        })
    end
    
    function functions:Toggle(config)
        config = config or {}
        return currentTab:CreateToggle({
            Name = config.text or "Toggle",
            CurrentValue = config.default or false,
            Callback = config.callback or function() end
        })
    end
    
    function functions:Slider(config)
        config = config or {}
        return currentTab:CreateSlider({
            Name = config.text or "Slider",
            Range = config.range or {0, 100},
            Increment = config.increment or 1,
            Suffix = config.suffix or "",
            CurrentValue = config.default or 50,
            Callback = config.callback or function() end
        })
    end
    
    -- Pre-made function combinations
    function functions:Walkspeed()
        self:Label("🎮 WalkSpeed")
        local speedBox = self:TextBox({placeholder = "Enter speed (16-200)", name = "Speed"})
        self:Button({
            text = "Change WalkSpeed", 
            click = function()
                local speed = tonumber(speedBox.CurrentValue) or 16
                if game.Players.LocalPlayer.Character then
                    game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = speed
                end
            end
        })
    end
    
    function functions:Jumppower()
        self:Label("🦘 Jump Power")
        local jumpBox = self:TextBox({placeholder = "Enter jump power (50-200)", name = "Jump"})
        self:Button({
            text = "Change Jump Power",
            click = function()
                local power = tonumber(jumpBox.CurrentValue) or 50
                if game.Players.LocalPlayer.Character then
                    game.Players.LocalPlayer.Character.Humanoid.JumpPower = power
                end
            end
        })
    end
    
    function functions:TeleportToPlayer()
        self:Label("🔁 Teleport to Player")
        local nameBox = self:TextBox({placeholder = "Enter player name", name = "Player Name"})
        self:Button({
            text = "Teleport",
            click = function()
                local targetName = nameBox.CurrentValue
                for _, player in pairs(game.Players:GetPlayers()) do
                    if string.lower(player.Name) == string.lower(targetName) and player.Character then
                        game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = player.Character.HumanoidRootPart.CFrame
                        break
                    end
                end
            end
        })
    end
    
    function functions:InfiniteJump()
        self:Label("∞ Infinite Jump")
        local toggle = self:Toggle({
            text = "Infinite Jump",
            callback = function(value)
                if value then
                    game:GetService("UserInputService").JumpRequest:Connect(function()
                        game.Players.LocalPlayer.Character:FindFirstChildOfClass("Humanoid"):ChangeState("Jumping")
                    end)
                end
            end
        })
    end
    
    function functions:SpeedBoost()
        self:Label("💨 Speed Boost")
        local boostBox = self:TextBox({placeholder = "Boost multiplier (1-10)", name = "Boost"})
        self:Button({
            text = "Activate Speed Boost",
            click = function()
                local boost = tonumber(boostBox.CurrentValue) or 2
                if game.Players.LocalPlayer.Character then
                    game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = game.Players.LocalPlayer.Character.Humanoid.WalkSpeed * boost
                end
            end
        })
    end
    
    function functions:ResetCharacter()
        self:Label("🔄 Reset Character")
        self:Button({
            text = "Reset My Character",
            click = function()
                if game.Players.LocalPlayer.Character then
                    game.Players.LocalPlayer.Character:BreakJoints()
                end
            end
        })
    end
    
    function functions:ClickTP()
        self:Label("👆 Click Teleport")
        local toggle = self:Toggle({
            text = "Click TP",
            callback = function(value)
                if value then
                    local mouse = game.Players.LocalPlayer:GetMouse()
                    mouse.Button1Down:Connect(function()
                        if value then
                            game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = CFrame.new(mouse.Hit.Position)
                        end
                    end)
                end
            end
        })
    end
    
    function functions:NoClip()
        self:Label("🚫 No Clip")
        local toggle = self:Toggle({
            text = "No Clip",
            callback = function(value)
                if game.Players.LocalPlayer.Character then
                    for _, part in pairs(game.Players.LocalPlayer.Character:GetDescendants()) do
                        if part:IsA("BasePart") then
                            part.CanCollide = not value
                        end
                    end
                end
            end
        })
    end
    
    function functions:AntiAFK()
        self:Label("⏰ Anti AFK")
        self:Button({
            text = "Enable Anti AFK",
            click = function()
                local VirtualUser = game:GetService("VirtualUser")
                game.Players.LocalPlayer.Idled:Connect(function()
                    VirtualUser:CaptureController()
                    VirtualUser:ClickButton2(Vector2.new())
                end)
            end
        })
    end
    
    function functions:ESPPlayers()
        self:Label("👁️ Player ESP")
        self:Button({
            text = "Show All Players",
            click = function()
                for _, player in pairs(game.Players:GetPlayers()) do
                    if player ~= game.Players.LocalPlayer and player.Character then
                        local highlight = Instance.new("Highlight")
                        highlight.Parent = player.Character
                        highlight.FillColor = Color3.new(1, 0, 0)
                        highlight.OutlineColor = Color3.new(1, 1, 1)
                    end
                end
            end
        })
    end
    
    function functions:DayTime()
        self:Label("🌞 Change Time")
        self:Button({
            text = "Set to Day",
            click = function()
                game.Lighting.ClockTime = 14
            end
        })
        self:Button({
            text = "Set to Night", 
            click = function()
                game.Lighting.ClockTime = 2
            end
        })
    end
    
    function functions:Fog()
        self:Label("🌫️ Fog Control")
        self:Button({
            text = "Remove Fog",
            click = function()
                game.Lighting.FogEnd = 100000
            end
        })
        self:Button({
            text = "Add Fog",
            click = function()
                game.Lighting.FogEnd = 100
            end
        })
    end
    
    function functions:FullBright()
        self:Label("💡 Full Bright")
        self:Button({
            text = "Enable Full Bright",
            click = function()
                game.Lighting.Ambient = Color3.new(1, 1, 1)
                game.Lighting.Brightness = 2
                game.Lighting.GlobalShadows = false
            end
        })
    end

    -- Return all functions
    return functions
end

return LuaLibrary
