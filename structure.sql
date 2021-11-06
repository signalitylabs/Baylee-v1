--
-- Database: `bayleelol`
--

-- --------------------------------------------------------

--
-- Table structure for table `commands`
--

DROP TABLE IF EXISTS `commands`;
CREATE TABLE `commands` (
  `module` varchar(55) NOT NULL,
  `command` varchar(55) NOT NULL,
  `config` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
-- --------------------------------------------------------

--
-- Table structure for table `guild_settings`
--

DROP TABLE IF EXISTS `guild_settings`;
CREATE TABLE `guild_settings` (
  `guild` bigint(20) NOT NULL,
  `cmd_disabled` varchar(255) NOT NULL,
  `cmd_nitro` varchar(255) NOT NULL,
  `mods_enabled` varchar(255) NOT NULL,
  `banner` varchar(100) NOT NULL DEFAULT 'welcome.png',
  `banner_msg` varchar(255) NOT NULL DEFAULT 'default',
  `welcome_post` varchar(55) NOT NULL,
  `starboard_post` varchar(55) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `userid` bigint(20) NOT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `itemid` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `namespace` varchar(55) NOT NULL,
  `emoji` varchar(55) NOT NULL,
  `image` varchar(55) NOT NULL,
  `description` varchar(155) NOT NULL,
  `forsale` int(11) DEFAULT 0,
  `type` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
-- --------------------------------------------------------

--
-- Table structure for table `money_balance`
--
DROP TABLE IF EXISTS `money_balance`;
CREATE TABLE `money_balance` (
  `userid` bigint(20) NOT NULL,
  `wallet` decimal(10,0) NOT NULL DEFAULT 1500,
  `bank` decimal(10,0) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
-- --------------------------------------------------------

--
-- Table structure for table `money_cooldowns`
--

DROP TABLE IF EXISTS `money_cooldowns`;
CREATE TABLE `money_cooldowns` (
  `userid` bigint(20) NOT NULL,
  `type` varchar(32) NOT NULL,
  `expiration` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
--
-- Indexes for dumped tables
--

--
-- Indexes for table `commands`
--
ALTER TABLE `commands`
  ADD UNIQUE KEY `module` (`module`,`command`);
--
-- Indexes for table `guild_settings`
--
ALTER TABLE `guild_settings`
  ADD PRIMARY KEY (`guild`);
--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD UNIQUE KEY `userid` (`userid`);
--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD UNIQUE KEY `itemid` (`itemid`);
--
-- Indexes for table `money_balance`
--
ALTER TABLE `money_balance`
  ADD PRIMARY KEY (`userid`) USING BTREE;
--
-- Indexes for table `money_cooldowns`
--
ALTER TABLE `money_cooldowns`
  ADD UNIQUE KEY `userid` (`userid`,`type`) USING BTREE;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `itemid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;
