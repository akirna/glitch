'''
Revised from the code segments:
http://stackoverflow.com/questions/23264569/python-3-x-basehttpserver-or-http-server
and
https://wiki.python.org/moin/BaseHttpServer#Official_Documentation

Xiannong Meng
2015-09-12
'''

from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib
import time
import os

#HOST_NAME = "localhost"
HOST_NAME = "brki164-lnx-19"  # any real host name where the server is running
HOST_PORT = 9000
server_name = "Python Server"

class MyServer(BaseHTTPRequestHandler):
    """
    def __init__(self, server_name, port=HOST_PORT):
        
        self.server_name = sever_name
        self.port = port
    """


    def do_HEAD(self):
        print("in do_HEAD");
        okay = self.check_file(self.path)
        if okay == True:
            self.send_response(200)  # good file
        else:
            self.send_response(404)  # bad file, we lump all codes for now
        cont_type = self.check_type(self.path)
        self.send_header("Server", server_name)
        self.send_header("Content-Type", cont_type)
        '''self.send_header("Access-Control-Allow-Origin","*");
        self.send_header("Access-Control-Expose-Headers: Access-Control-Allow-Origin");
        self.send_header(("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"));'''
        self.end_headers()
    
    def do_GET(self):
        print("in do_GET");
        okay = self.check_file(self.path)
        self.path=self.path[1:]
        if okay:
            a=open(self.path,'a')
            a.write("\n appending")
            a.close()
        else:
            f=open(self.path,'w')
            f.write("\n new file")
            f.close()
        g=open(self.path,'r')
        self.wfile.write(g.read().encode("utf-8"))
        g.close()


    def do_POST(self):
        length = int(self.headers['Content-Length'])
        post_data = urllib.parse.parse_qs(self.rfile.read(length).decode('utf-8'))
        # You now have a dictionary of the post data
        print("post data: ", post_data)
        
        # now you have a dictionary of post data
        ret_data = self.build_data(post_data)
        self.wfile.write(ret_data.encode("utf-8"))
        self.wfile.write("Lorem Ipsum".encode("utf-8"))

    def build_data(self, post_data):
        """
        The post_data is in the form of 
        {'key1': ['val1'], 'key2': ['val2'], 'key3': ['val3']}
        e.g., 
        {'SecondInput': ['zx  z'], 'FirstInput': ['124'], 'Submit': ['Submit']}
        """
        ret_str = ""
        for k in post_data:
            ret_str = ret_str + "key : " + str(k) + "\ndata : " + str(post_data[k]) + "\n"
        ret_str = ret_str + "\n"

        return ret_str
        
    def find_file_length(self, path):

        first = path.find("/")
        if first != 0:
            return 0

        # now we know the '/' leads the path, remove it
        path = path[1:]
        length = os.path.getsize(path)

        return length

    def check_file(self, path):
        """
        Check to see if file or path exists.
        (for now, we only deal with files, need to handle directories
        """
        first = path.find("/")
        if first != 0:
            return False  # when we handle directory, this needs change

        # now we know the '/' leads the path, remove it
        path = path[1:]

        okay = False
        try:
#            r = open(path, encoding = "utf-8")
            okay = os.path.exists(path)
        except OSError:
            pass
        return okay

    def send_file(self, path):
        f = None
        data = None
        path = path[1:]
        try:
#            f = open(path, encoding = "utf-8")
            f = open(path, "rb")
            data = f.read()
            f.close()
#            self.wfile.write(bytes(data, "utf-8"))
            self.wfile.write(bytes(data))
        except OSError:
            pass

    def check_type(self, path):
        file_type = "text/html"  # default
        if path.endswith(".jpg") or \
                path.endswith(".jpeg"):
            file_type = "image/jpeg"      # jpeg image
        elif path.endswith(".png"):
            file_type = "image/png"        # png image
        elif path.endswith(".js"):
            file_type = "text/javascript"  # javascript
        return file_type
        
            
if __name__ == '__main__':

    httpd = HTTPServer((HOST_NAME, HOST_PORT), MyServer)
    print(time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, HOST_PORT))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, HOST_PORT))

'''
myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))
'''
