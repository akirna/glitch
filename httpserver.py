'''
Revised from the code segments:
http://stackoverflow.com/questions/23264569/python-3-x-basehttpserver-or-http-server
and
https://wiki.python.org/moin/BaseHttpServer#Official_Documentation


2015-09-12
'''

from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib
#import urllib.request
import requests
import time
import os
from os.path import isfile, join
import operator

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
        '''okay = self.check_file(self.path)
        if okay == True:
            self.send_response(200)  # good file
        else:
            self.send_response(404)  # bad file, we lump all codes for now
        cont_type = self.check_type(self.path)'''
        self.send_response(200)
        self.send_header("Server", server_name)
        self.send_header("Content-Type", "text")
        self.send_header("Access-Control-Allow-Origin","*")
        self.end_headers()
    
    def do_GET(self):
        mypath=os.getcwd()
        onlyfiles = [ f for f in os.listdir(mypath) if isfile(join(mypath,f)) ]
        info={}
        for x in onlyfiles:
            fd = os.open(x, os.O_RDWR|os.O_CREAT )
            fileInfo= os.fstat(fd)
            info[x]=fileInfo[8]
        sortedFiles = sorted(info.items(), key=operator.itemgetter(1),reverse=True)
        aList = []
        for x in sortedFiles:
            if("~" != x[0][-1] and x[0] != "httpserver.py"):
                aList +=[x]
        if len(aList)>5:
            aList= aList[:5]
 
        self.do_HEAD()
        allfiles = []
        for x in aList:
                self.wfile.write((x[0]).encode("utf-8"))
                self.wfile.write(("\n").encode("utf-8"))
                 
    

    def do_POST(self):
        length = int(self.headers['Content-Length'])
        post_data = urllib.parse.parse_qs(self.rfile.read(length).decode('utf-8'))
        # You now have a dictionary of the post data
        print("post data: ", post_data)
        for k in post_data:
            imgVidAudExtensions=[".png",".jpeg",".jpg",".tiff",".gif",".bmp",".svg",".mp4",\
                                 ".flv",".ogg",".gifv",".mov",".qt",".wmv",".m4p",".m4v",\
                                 ".mpg",".mp2",".mpeg",".mp3",".wav",".wma",".m4a"]
            if post_data[k][0][-4:] in imgVidAudExtensions:
                #gets the name of the file
                fileName=""
                i=-1
                while(post_data[k][0][i]!="/"):
                    fileName+=post_data[k][0][i]
                    i-=1
                fileName=fileName[::-1]
                #if the name already exists, add a number to the end
                if(os.path.isfile(fileName)):
                    num=1
                    fileName=fileName[:-4]+str(num)+fileName[-4:]
                while(os.path.isfile(fileName)):
                    num+=1
                    fileName=fileName[:-4]+str(num)+fileName[-4:]
                #urllib.request.urlretrieve(post_data[k][0], fileName)
                r = requests.get(post_data[k][0], stream=True)
                with open(fileName, 'wb') as f:
                    print("Downloading...")
                    for chunk in r.iter_content(chunk_size=1024): 
                        if chunk:
                            f.write(chunk)
                    print("Complete")
            else:
                okay= os.path.isfile(k)
                if okay:
                    f=open(str(k),"a")
                else:
                    f=open(str(k),"w")
                    f.write(str(post_data[k]))
                    f.close()
                
        # now you have a dictionary of post data
        #ret_data = self.build_data(post_data)
        #self.wfile.write(ret_data.encode("utf-8"))
        #self.wfile.write("Lorem Ipsum".encode("utf-8"))

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
