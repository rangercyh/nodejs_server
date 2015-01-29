# nodejs_server
deprecated
{
in order to deal with FIN_WAIT2, set the env like this:

cat /proc/sys/net/ipv4/tcp_keepalive_time  7200
cat /proc/sys/net/ipv4/tcp_keepalive_intvl  75
cat /proc/sys/net/ipv4/tcp_keepalive_probes  9
echo 60 > /proc/sys/net/ipv4/tcp_keepalive_time
echo 5 > /proc/sys/net/ipv4/tcp_keepalive_intvl
echo 3 > /proc/sys/net/ipv4/tcp_keepalive_probes
}

# because of company reason, I can't put something like extend this to mutiple process on github.
so if you want to what's the next, you can contact me!
