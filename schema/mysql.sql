# Dump of table User
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userinfo` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_ACCOUNT_NAME` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


# Dump of table Player
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Player` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_GAME_NAME` (`name`),
  KEY `INDEX_PALYER_USER_ID` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


# Dump of table NormalBag
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Bag` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `playerId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `items` varchar(5000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '{}',
  `itemCount` smallint(6) unsigned NOT NULL DEFAULT '20',
  PRIMARY KEY (`id`),
  KEY `INDEX_PLAYER_ID` (`playerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


